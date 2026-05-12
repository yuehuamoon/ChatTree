package chat.chatcommon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Chat-Common 作为公共依赖模块并不需要独立运行，
 * 此类仅用于让 Spring Boot 在扫描 common 包时可以识别，
 * 同时方便在 IDE 中标记为模块入口。
 */
@SpringBootApplication
public class ChatCommonApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatCommonApplication.class, args);
    }
}
