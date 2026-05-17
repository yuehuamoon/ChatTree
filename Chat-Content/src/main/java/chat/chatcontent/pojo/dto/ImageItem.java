package chat.chatcontent.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 图片项
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageItem {
    private String base64;      // Base64 图片数据
    private String fileName;    // 原始文件名
}