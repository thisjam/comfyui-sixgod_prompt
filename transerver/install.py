# import subprocess
# import sys
 
# def install_packge():
#     try:
#         from openai import OpenAI
#         print("openai package is successfully imported.")
#     except ImportError as e:
#         print("Failed to import openai package.")
#     package_name = "openai"
#     install_command = [sys.executable, "-m", "pip", "install", package_name]
#     try:
#         print(f"Attempting to install {package_name}...")
#         subprocess.run(install_command, check=True)
#         print(f"{package_name} has been successfully installed.")
#     except subprocess.CalledProcessError as e:
#      print(f"An error occurred while trying to install the package: {e}")

#     # 再次尝试导入，以验证安装是否成功
#     try:
#         from openai import OpenAI
#         print("openai package is now successfully imported.")
#     except ImportError as e:
#        print("Failed to install openai package, please check your installation.")
#     return  OpenAI   