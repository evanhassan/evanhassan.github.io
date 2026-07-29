#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
import webbrowser

PORT = 8000
ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)
url = f"http://127.0.0.1:{PORT}/"
print(f"Serving {ROOT}")
print(f"Open {url}")
try:
    webbrowser.open(url)
except Exception:
    pass
ThreadingHTTPServer(("127.0.0.1", PORT), SimpleHTTPRequestHandler).serve_forever()
