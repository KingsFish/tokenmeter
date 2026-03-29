#!/usr/bin/env python3
"""
Dashboard HTTP Server for usage-tracker plugin.

Serves static files and provides API endpoints for usage data and price configuration.
"""

import json
import os
import signal
import subprocess
import sys
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse

# Configuration
DEFAULT_PORT = 8765
DASHBOARD_DIR = Path(__file__).parent.parent / "dashboard"
SCRIPTS_DIR = Path(__file__).parent
PROJECT_ROOT = Path(__file__).parent.parent

# Price config locations
PRICE_CONFIG_USER = Path.home() / ".claude" / "usage-tracker" / "prices.json"
PRICE_CONFIG_LOCAL = PROJECT_ROOT / "config" / "prices.json"


class DashboardHandler(SimpleHTTPRequestHandler):
    """HTTP request handler for dashboard server."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DASHBOARD_DIR), **kwargs)

    def log_message(self, format, *args):
        """Log requests to console."""
        print(f"[{self.log_date_time_string()}] {format % args}")

    def _send_json_response(self, data, status=200):
        """Send JSON response with CORS headers."""
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def _send_error_response(self, message, status=500):
        """Send JSON error response."""
        self._send_json_response({"error": message}, status=status)

    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        """Handle GET requests."""
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path == "/api/usage":
            self._handle_usage_api()
        elif path == "/api/prices":
            self._handle_get_prices()
        elif path == "/api/health":
            self._handle_health()
        else:
            # Serve static files
            super().do_GET()

    def do_POST(self):
        """Handle POST requests."""
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path == "/api/prices":
            self._handle_post_prices()
        else:
            self._send_error_response("Not found", status=404)

    def _handle_usage_api(self):
        """Handle GET /api/usage - call parse-usage.sh and return JSON."""
        try:
            parse_script = SCRIPTS_DIR / "parse-usage.sh"
            if not parse_script.exists():
                self._send_error_response("parse-usage.sh not found", status=500)
                return

            result = subprocess.run(
                [str(parse_script)],
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode != 0:
                self._send_error_response(
                    f"parse-usage.sh failed: {result.stderr}",
                    status=500
                )
                return

            try:
                data = json.loads(result.stdout)
                self._send_json_response(data)
            except json.JSONDecodeError as e:
                self._send_error_response(f"Invalid JSON from parse-usage.sh: {e}", status=500)

        except subprocess.TimeoutExpired:
            self._send_error_response("parse-usage.sh timed out", status=504)
        except Exception as e:
            self._send_error_response(f"Error running parse-usage.sh: {e}", status=500)

    def _handle_get_prices(self):
        """Handle GET /api/prices - return price configuration."""
        try:
            # Check user config first, then fallback to local config
            if PRICE_CONFIG_USER.exists():
                config_path = PRICE_CONFIG_USER
            elif PRICE_CONFIG_LOCAL.exists():
                config_path = PRICE_CONFIG_LOCAL
            else:
                # Return default config if no file exists
                default_config = {
                    "model_prices": {},
                    "default_price": {
                        "input_per_million": 3.0,
                        "output_per_million": 15.0
                    }
                }
                self._send_json_response(default_config)
                return

            with open(config_path, "r") as f:
                data = json.load(f)
            self._send_json_response(data)

        except json.JSONDecodeError as e:
            self._send_error_response(f"Invalid JSON in price config: {e}", status=500)
        except Exception as e:
            self._send_error_response(f"Error reading price config: {e}", status=500)

    def _handle_post_prices(self):
        """Handle POST /api/prices - update price configuration."""
        try:
            # Read request body
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                self._send_error_response("Request body is empty", status=400)
                return

            body = self.rfile.read(content_length).decode("utf-8")

            # Parse and validate JSON
            try:
                data = json.loads(body)
            except json.JSONDecodeError as e:
                self._send_error_response(f"Invalid JSON: {e}", status=400)
                return

            # Validate structure
            if not isinstance(data, dict):
                self._send_error_response("Price config must be an object", status=400)
                return

            if "model_prices" not in data:
                self._send_error_response("Missing 'model_prices' field", status=400)
                return

            if "default_price" not in data:
                self._send_error_response("Missing 'default_price' field", status=400)
                return

            # Validate model_prices structure
            if not isinstance(data["model_prices"], dict):
                self._send_error_response("'model_prices' must be an object", status=400)
                return

            for model, prices in data["model_prices"].items():
                if not isinstance(prices, dict):
                    self._send_error_response(
                        f"Price for model '{model}' must be an object",
                        status=400
                    )
                    return
                if "input_per_million" not in prices or "output_per_million" not in prices:
                    self._send_error_response(
                        f"Price for model '{model}' missing input_per_million or output_per_million",
                        status=400
                    )
                    return

            # Validate default_price structure
            if not isinstance(data["default_price"], dict):
                self._send_error_response("'default_price' must be an object", status=400)
                return

            if "input_per_million" not in data["default_price"] or "output_per_million" not in data["default_price"]:
                self._send_error_response(
                    "'default_price' missing input_per_million or output_per_million",
                    status=400
                )
                return

            # Ensure user config directory exists
            PRICE_CONFIG_USER.parent.mkdir(parents=True, exist_ok=True)

            # Write to user config file
            with open(PRICE_CONFIG_USER, "w") as f:
                json.dump(data, f, indent=2)
                f.write("\n")  # Add trailing newline

            self._send_json_response({"success": True, "message": "Price configuration saved"})

        except Exception as e:
            self._send_error_response(f"Error saving price config: {e}", status=500)

    def _handle_health(self):
        """Handle GET /api/health - health check endpoint."""
        self._send_json_response({"status": "ok"})


def run_server(port):
    """Run the HTTP server."""
    server_address = ("", port)
    httpd = HTTPServer(server_address, DashboardHandler)
    print(f"Dashboard server starting on http://localhost:{port}")
    print(f"Serving files from: {DASHBOARD_DIR}")
    print(f"Press Ctrl+C to stop")

    # Open browser
    try:
        webbrowser.open(f"http://localhost:{port}")
    except Exception as e:
        print(f"Warning: Could not open browser: {e}")

    return httpd


def main():
    """Main entry point."""
    port = int(os.environ.get("PORT", DEFAULT_PORT))

    httpd = run_server(port)

    # Handle graceful shutdown
    def signal_handler(sig, frame):
        print("\nShutting down server...")
        httpd.shutdown()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()