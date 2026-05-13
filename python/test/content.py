import requests
import base64
import json

# ===================== 配置 =====================
BASE_URL = "http://localhost:80841"  # Chat-Content 服务端口
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


def image_to_base64(image_path):
    """读取图片并转为 Base64"""
    try:
        with open(image_path, "rb") as f:
            image_data = f.read()
            base64_str = base64.b64encode(image_data).decode("utf-8")
            # 添加前缀
            if image_path.endswith('.png'):
                return f"data:image/png;base64,{base64_str}"
            else:
                return f"data:image/jpeg;base64,{base64_str}"
    except FileNotFoundError:
        print(f"图片不存在: {image_path}")
        return None


def test_publish(email, title, content, image_paths=None, tags=""):
    """发布内容"""
    url = f"{BASE_URL}/content/publish"

    data = {
        "email": email,
        "title": title,
        "content": content,
        "tags": tags
    }

    # 处理图片
    image_base64_list = []
    image_name_list = []
    if image_paths:
        for path in image_paths:
            base64_str = image_to_base64(path)
            if base64_str:
                image_base64_list.append(base64_str)
                image_name_list.append(path.split("/")[-1])

    data["imageBase64List"] = image_base64_list
    data["imageNameList"] = image_name_list

    resp = requests.post(url, json=data, headers=HEADERS)
    print_result(f"发布内容 - {title}", resp)
    return resp


def test_my_list(email):
    """查询自己发布的所有内容"""
    url = f"{BASE_URL}/content/myList"
    data = {"email": email}
    resp = requests.post(url, json=data, headers=HEADERS)
    print_result(f"我的内容列表 - {email}", resp)
    return resp


def test_delete(content_id):
    """删除内容"""
    url = f"{BASE_URL}/content/delete"
    data = {"id": content_id}
    resp = requests.post(url, json=data, headers=HEADERS)
    print_result(f"删除内容 ID={content_id}", resp)
    return resp


def test_get_by_id(content_id):
    """根据ID查询内容"""
    url = f"{BASE_URL}/content/getById"
    data = {"id": content_id}
    resp = requests.post(url, json=data, headers=HEADERS)
    print_result(f"查询内容 ID={content_id}", resp)
    return resp


def test_meet_list(page=1, size=10):
    """查看遇见的内容（分页）"""
    url = f"{BASE_URL}/content/meetList"
    data = {"page": page, "size": size}
    resp = requests.post(url, json=data, headers=HEADERS)
    print_result(f"遇见内容列表 (第{page}页)", resp)
    return resp


def test_count():
    """统计数据"""
    url = f"{BASE_URL}/content/count"
    resp = requests.get(url, headers=HEADERS)
    print_result("统计信息", resp)
    return resp


def test_hello():
    """健康检查"""
    url = f"{BASE_URL}/content/hello"
    try:
        resp = requests.get(url, headers=HEADERS)
        print_result("健康检查", resp)
        return resp
    except:
        print("❌ 服务连接失败")
        return None


def run_full_flow():
    """完整流程测试"""
    print("\n" + "#" * 40)
    print("完整流程测试")
    print("#" * 40)

    test_email = "test_content@qq.com"

    # 1. 发布内容（带图片）
    image_paths = [
        "/home/haha/Pictures/test1.jpg",
        "/home/haha/Pictures/test2.png"
    ]
    # 过滤不存在的图片
    existing_images = [p for p in image_paths if __import__('os').path.exists(p)]

    resp = test_publish(
        email=test_email,
        title="我的第一篇内容",
        content="这是测试内容正文...",
        image_paths=existing_images if existing_images else None,
        tags="测试,Java"
    )

    # 获取发布的内容ID
    content_id = None
    if resp.status_code == 200:
        result = resp.json()
        if result.get("code") == 200:
            content_id = result.get("data")
            print(f"✅ 发布成功，内容ID: {content_id}")

    # 2. 查询我的内容列表
    test_my_list(test_email)

    # 3. 根据ID查询内容
    if content_id:
        test_get_by_id(content_id)

    # 4. 查看遇见的内容
    test_meet_list(1, 10)

    # 5. 统计信息
    test_count()

    # 6. 删除内容（清理）
    if content_id:
        test_delete(content_id)

    # 7. 再次查询确认已删除
    test_my_list(test_email)


def run_simple_test():
    """简单测试（不依赖图片）"""
    print("\n" + "#" * 40)
    print("简单测试（无图片）")
    print("#" * 40)

    test_email = "simple_test@qq.com"

    # 发布无图片内容
    resp = test_publish(
        email=test_email,
        title="简单测试内容",
        content="这是没有图片的测试内容...",
        image_paths=None,
        tags="测试"
    )

    content_id = None
    if resp.status_code == 200:
        result = resp.json()
        if result.get("code") == 200:
            content_id = result.get("data")
            print(f"✅ 发布成功，内容ID: {content_id}")

    # 查询
    test_my_list(test_email)

    # 遇见内容
    test_meet_list(1, 5)

    # 统计
    test_count()

    # 删除
    if content_id:
        test_delete(content_id)


def interactive_test():
    """交互式测试"""
    print("\n" + "#" * 40)
    print("交互式测试")
    print("#" * 40)

    email = input("邮箱: ").strip()
    title = input("标题: ").strip()
    content = input("内容: ").strip()

    print("\n请输入图片路径（多张用逗号分隔，直接回车跳过）:")
    images_input = input("图片路径: ").strip()

    image_paths = []
    if images_input:
        for path in images_input.split(","):
            path = path.strip()
            if __import__('os').path.exists(path):
                image_paths.append(path)
            else:
                print(f"⚠️ 图片不存在: {path}")

    test_publish(email, title, content, image_paths if image_paths else None)


def test_exception_cases():
    """异常情况测试"""
    print("\n" + "#" * 40)
    print("异常测试")
    print("#" * 40)

    # 缺少邮箱
    print("\n--- 缺少邮箱 ---")
    url = f"{BASE_URL}/content/publish"
    resp = requests.post(url, json={"title": "测试"}, headers=HEADERS)
    print_result("缺少邮箱", resp)

    # 缺少标题
    print("\n--- 缺少标题 ---")
    resp = requests.post(url, json={"email": "test@qq.com"}, headers=HEADERS)
    print_result("缺少标题", resp)

    # 删除不存在的内容
    print("\n--- 删除不存在的内容 ---")
    test_delete(99999)

    # 查询不存在的内容
    print("\n--- 查询不存在的内容 ---")
    test_get_by_id(99999)


if __name__ == "__main__":
    print("=" * 50)
    print("Chat-Content 接口测试")
    print("=" * 50)

    # 检查服务
    if not test_hello():
        print("\n❌ 服务连接失败，请检查:")
        print("   1. Chat-Content 是否已启动")
        print("   2. 端口是否正确（当前: 8082）")
        exit(1)

    print("\n请选择测试模式:")
    print("1. 完整流程测试（注册→查询→删除）")
    print("2. 简单测试（无图片）")
    print("3. 交互式发布")
    print("4. 异常测试")
    print("5. 仅查看遇见内容")

    choice = input("\n请输入选项 (1-5): ").strip()

    if choice == "1":
        run_full_flow()
    elif choice == "2":
        run_simple_test()
    elif choice == "3":
        interactive_test()
    elif choice == "4":
        test_exception_cases()
        test_meet_list(1, 10)
        test_count()
    elif choice == "5":
        test_meet_list(1, 10)
        test_count()
    else:
        print("无效选项，运行简单测试...")
        run_simple_test()