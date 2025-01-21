# Download and install pip
import sys
import os
import tempfile
import urllib.request
import zipfile

def download_pip():
    url = "https://bootstrap.pypa.io/get-pip.py"
    response = urllib.request.urlopen(url)
    return response.read()

def install_pip():
    script_content = download_pip()
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(script_content)
        temp_file_path = temp_file.name

    # Run the script to install pip
    os.system(f"python {temp_file_path}")

if __name__ == "__main__":
    install_pip()
