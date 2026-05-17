import requests
import json

def testpullRecommend():
    # 接口地址
    url = "http://localhost:8081/content/meetList"  # 根据实际情况修改端口

    # 请求体数据
    data = {
        "email": "1@qq.com",
        "id": "9"
    }

    # 发送 POST 请求
    response = requests.post(
        url,
        json=data,  # 自动序列化为 JSON
        headers={"Content-Type": "application/json"}
    )

    # 处理响应
    if response.status_code == 200:
        result = response.json()
        print("状态码:", result.get("code"))
        print("消息:", result.get("message"))
        print("数据:", result.get("data"))
    else:
        print(f"请求失败，状态码: {response.status_code}")


BASE_URL = "http://localhost:8081"

# 1. 获取推荐
def get_recommendations(email, content_id):
    response = requests.post(f"{BASE_URL}/content/recommend", json={"email": email, "id": content_id})
    return response.json()

# 2. 删除推荐
def delete_recommendation(email, content_id, target_id):
    response = requests.post(f"{BASE_URL}/content/deleteRecommend", json={"email": email, "id": content_id, "targetId": target_id})
    return response.json()


result = get_recommendations("1@qq.com", 9)
print(result)

for i in result.get("data"):
    n = delete_recommendation("1@qq.com", 9, i.get("id"))
    print(n)
    result = get_recommendations("1@qq.com", 9)
    print(result)