import requests
import base64
import json

BASE_URL = "http://localhost:8081"
IMAGE_PATH = "/home/haha/Pictures/伊蕾娜2.png"

# 1. 读取图片并转 Base64
with open(IMAGE_PATH, "rb") as f:
    image_base64 = base64.b64encode(f.read()).decode("utf-8")

# 2. 构建 JSON 数据（头像放 JSON 里）
user_data = {
    "email": "test_pic@11.com",
    "username": "haha",
    "password": "123456",
    "nickname": "wobuzhidao",
    'avatar': IMAGE_PATH,
    "avatarBase64": image_base64      # Base64 字符串
}

# 3. 发送 JSON 请求
resp = requests.post(
    f"{BASE_URL}/user/register",
    json=user_data,
    headers={"Content-Type": "application/json"}
)

print(f"状态码: {resp.status_code}")
print(f"响应: {resp.json()}")