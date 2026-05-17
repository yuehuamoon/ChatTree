package chat.chatcontent.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommentDTO {

    private Long id;
    private String email;           // 发布者邮箱
    private String title;           // 标题
    private String content;         // 文字内容
    private String images;
    private List<String> imageBase64List;   // Base64 列表
    private List<String> imageNameList;     // 原始文件名列表（顺序对应）
    private Long targetId;
}
