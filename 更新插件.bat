@chcp 65001 > nul
@echo off
REM 确保当前目录是本地仓库根目录
cd /d "%~dp0"

REM 拉取远程仓库最新更改并尝试合并到当前分支
REM git fetch origin
REM git merge origin/main

REM 若使用pull命令替代merge命令（拉取并自动合并）
git pull origin main

echo 本地仓库已与远程仓库https://github.com/thisjam/comfyui-sixgod_prompt同步至最新状态。
pause