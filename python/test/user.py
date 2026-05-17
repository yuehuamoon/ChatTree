import requests
import json

# ===================== 配置 =====================
BASE_URL = "http://localhost:8081/"  # 根据你的 Chat-User 实际端口修改
HEADERS = {"Content-Type": "application/json"}


# ===============================================

def print_result(title, resp):
    """格式化打印响应"""
    print(f"\n{'=' * 20} {title} {'=' * 20}")
    try:
        print(json.dumps(resp.json(), ensure_ascii=False, indent=2))
    except:
        print(resp.text)
    print(f"状态码: {resp.status_code}")


def test_register(email, username, password, nickname="测试用户", avatar="http://example.com/avatar.png"):
    """注册用户"""
    url = f"{BASE_URL}/user/register"
    data = {
        "email": email,
        "username": username,
        "password": password,
        "nickname": nickname,
        "avatar": avatar
    }
    resp = requests.post(url, json=data, headers=HEADERS)
    print_result("注册", resp)
    return resp


def test_login(email, password):
    """登录"""
    url = f"{BASE_URL}/user/login"
    data = {
        "email": email,
        "password": password
    }
    resp = requests.post(url, json=data, headers=HEADERS)
    print_result("登录", resp)
    # 返回 token（假设 Result.data 就是 token 字符串）
    if resp.status_code == 200 and resp.json().get("code") == 200:
        return resp.json().get("data")
    return None


def test_update(email, nickname=None, avatar=None, status=None):
    """更新用户信息（选择性）"""
    url = f"{BASE_URL}/user/update"
    data = {"email": email}
    if nickname is not None:
        data["nickname"] = nickname
    if avatar is not None:
        data["avatar"] = avatar
    if status is not None:
        data["status"] = status
    resp = requests.post(url, json=data, headers=HEADERS)
    print_result("更新用户", resp)
    return resp


def test_identify(email, status):
    """管理员修改用户状态（status: 1正常, 0禁用）"""
    url = f"{BASE_URL}/user/identify"
    data = {"email": email, "status": status}
    resp = requests.post(url, json=data, headers=HEADERS)
    print_result("状态修改", resp)
    return resp


def test_count():
    """获取用户统计数据"""
    url = f"{BASE_URL}/user/count"
    resp = requests.get(url, headers=HEADERS)
    print_result("用户统计", resp)
    return resp


def test_delete(email):
    """删除用户（根据邮箱）"""
    url = f"{BASE_URL}/user/delete"
    data = {"email": email}
    resp = requests.post(url, json=data, headers=HEADERS)
    print_result("删除用户", resp)
    return resp


def run_full_flow():
    """完整流程测试：注册 -> 登录 -> 更新 -> 状态修改 -> 统计 -> 删除"""
    test_email = "test1@qq.com"
    test_password = "123456"

    # 1. 注册
    r1 = test_register(test_email, "flowuser", test_password, nickname="流程测试")
    if r1.status_code != 200 or r1.json().get("code") != 200:
        print("注册失败，流程终止")
        return

    # 2. 登录
    token = test_login(test_email, test_password)
    if not token:
        print("登录失败，流程终止")
        return
    print(f"获取到 token: {token[:30]}...")

    # 3. 更新昵称和头像
    test_update(test_email, nickname="新昵称", avatar="http://new.avatar.png")

    # 4. 管理员禁用用户
    test_identify(test_email, 0)  # 禁用
    test_identify(test_email, 1)  # 恢复启用

    # 5. 获取统计信息
    test_count()

    # 6. 删除用户（清理数据）
    test_delete(test_email)


def run_exception_tests():
    """异常情况测试"""
    print("\n\n" + "#" * 30 + " 异常测试 " + "#" * 30)

    # 重复注册
    print("\n--- 重复注册同一邮箱 ---")
    test_register("duplicate@test.com", "dup1", "123456")
    test_register("duplicate@test.com", "dup2", "123456")  # 应失败

    # 错误密码登录
    print("\n--- 错误密码登录 ---")
    test_register("wrongpwd@test.com", "wrong", "correct")
    test_login("wrongpwd@test.com", "wrongpassword")  # 应失败

    # 更新不存在的用户
    print("\n--- 更新不存在的用户 ---")
    test_update("notexist@test.com", nickname="无效")

    # 删除不存在的用户
    print("\n--- 删除不存在的用户 ---")
    test_delete("notexist@test.com")

    # 管理员操作缺少邮箱
    print("\n--- 缺少邮箱字段的状态修改 ---")
    url = f"{BASE_URL}/user/identify"
    resp = requests.post(url, json={"status": 1}, headers=HEADERS)
    print_result("缺少邮箱", resp)


def main():
    """主函数，可选择运行全部或部分测试"""
    print("开始测试 Chat-User 服务...")

    # 1. 完整流程（会注册、更新、删除，但删除前统计仍能看到数据）
    run_full_flow()

    # 2. 异常场景测试
    run_exception_tests()

    print("\n" + "=" * 50)
    print("测试完成。")


if __name__ == '__main__':
    main()