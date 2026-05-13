# main.py
import random

from fastapi import FastAPI
import requests
import threading
import time
import uvicorn
import socket
import pymysql

app = FastAPI()

# Nacos 配置
NACOS_SERVER = "127.0.0.1:8848"
SERVICE_NAME = "Chat-Recomment"
SERVICE_PORT = 8001


# 获取本机 IP
def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"


SERVICE_IP = get_local_ip()
print(f"本机 IP: {SERVICE_IP}")


class NacosClient:
    def __init__(self, server_addr):
        self.server_addr = server_addr

    def register(self, service_name, ip, port):
        """注册服务到 Nacos"""
        url = f"http://{self.server_addr}/nacos/v1/ns/instance"
        params = {
            "serviceName": service_name,
            "ip": ip,
            "port": port,
            "ephemeral": "true",
            "healthy": "true"
        }
        try:
            resp = requests.post(url, params=params, timeout=5)
            print(f"注册响应: {resp.status_code} - {resp.text}")
            return resp.status_code == 200
        except Exception as e:
            print(f"注册失败: {e}")
            return False

    def deregister(self, service_name, ip, port):
        """从 Nacos 注销"""
        url = f"http://{self.server_addr}/nacos/v1/ns/instance"
        params = {
            "serviceName": service_name,
            "ip": ip,
            "port": port
        }
        try:
            resp = requests.delete(url, params=params, timeout=5)
            return resp.status_code == 200
        except Exception as e:
            print(f"注销失败: {e}")
            return False

    def heartbeat(self, service_name, ip, port):
        """发送心跳"""
        url = f"http://{self.server_addr}/nacos/v1/ns/instance/beat"
        params = {
            "serviceName": service_name,
            "ip": ip,
            "port": port
        }
        try:
            resp = requests.put(url, params=params, timeout=5)
            return resp.status_code == 200
        except Exception as e:
            print(f"心跳失败: {e}")
            return False


nacos_client = NacosClient(NACOS_SERVER)


def heartbeat_loop():
    """心跳保活线程"""
    while True:
        try:
            success = nacos_client.heartbeat(SERVICE_NAME, SERVICE_IP, SERVICE_PORT)
            if not success:
                print("心跳发送失败，尝试重新注册...")
                nacos_client.register(SERVICE_NAME, SERVICE_IP, SERVICE_PORT)
        except Exception as e:
            print(f"心跳异常: {e}")
        time.sleep(5)


@app.on_event("startup")
async def startup():
    print(f"正在注册服务到 Nacos: {SERVICE_NAME} ({SERVICE_IP}:{SERVICE_PORT})")
    if nacos_client.register(SERVICE_NAME, SERVICE_IP, SERVICE_PORT):
        print(f"✅ 服务注册成功")
    else:
        print(f"❌ 服务注册失败")

    # 启动心跳线程
    thread = threading.Thread(target=heartbeat_loop, daemon=True)
    thread.start()


@app.on_event("shutdown")
async def shutdown():
    print(f"正在从 Nacos 注销服务...")
    nacos_client.deregister(SERVICE_NAME, SERVICE_IP, SERVICE_PORT)
    print(f"✅ 服务已注销")


# ========== 业务接口 ==========
@app.get("/hello")
async def hello():
    return {"message": "Hello from Python Recommendation Service"}


from contextlib import contextmanager


class MySQLClient:
    def __init__(self, host='localhost', port=3306, user='root',
                 password='123456', database='chat_user', charset='utf8mb4'):
        self.config = {
            'host': host,
            'port': port,
            'user': user,
            'password': password,
            'database': database,
            'charset': charset
        }
        self.conn = None

    def connect(self):
        """连接数据库"""
        self.conn = pymysql.connect(**self.config)
        return self.conn

    def close(self):
        """关闭连接"""
        if self.conn:
            self.conn.close()

    @contextmanager
    def get_cursor(self):
        """获取游标（自动管理）"""
        if not self.conn:
            self.connect()
        cursor = self.conn.cursor()
        try:
            yield cursor
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            raise e
        finally:
            cursor.close()

    def get_count(self, table_name, where_condition=None):
        """获取表数据数量"""
        sql = f"SELECT COUNT(*) FROM {table_name}"
        if where_condition:
            sql += f" WHERE {where_condition}"

        with self.get_cursor() as cursor:
            cursor.execute(sql)
            return cursor.fetchone()[0]

    def execute_query(self, sql, params=None):
        """执行查询，返回结果"""
        with self.get_cursor() as cursor:
            cursor.execute(sql, params)
            return cursor.fetchall()

    def execute_update(self, sql, params=None):
        """执行更新，返回影响行数"""
        with self.get_cursor() as cursor:
            affected = cursor.execute(sql, params)
            return affected

    def get_all_tables(self):
        """获取所有表名"""
        sql = "SHOW TABLES"
        with self.get_cursor() as cursor:
            cursor.execute(sql)
            return [row[0] for row in cursor.fetchall()]



@app.get("/recomment")
async def recommend():

    result = set({})
    count = client.get_count('content_article')

    for i in range(3):
        result.add(random.randint(1, count))

    return {
        "code": 200,
        "message": "success",
        "data": list(result)
    }


@app.post("/recommend/batch")
async def batch_recommend(user_ids: list):
    results = []

    for uid in user_ids:
        results.append({
            "user_id": uid,
            "recommendations": [f"推荐商品_{uid}_1", f"推荐商品_{uid}_2"]
        })
    return {
        "code": 200,
        "message": "success",
        "data": results
    }


if __name__ == "__main__":
    client = MySQLClient(
        host='localhost',
        port=3306,
        user='root',
        password='123456',
        database='chat_platform'
    )
    print(f"启动 FastAPI 服务: http://{SERVICE_IP}:{SERVICE_PORT}")
    uvicorn.run(app, host="0.0.0.0", port=SERVICE_PORT)