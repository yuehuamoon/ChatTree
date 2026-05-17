package chat.chatcontent.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContentDTO implements Serializable {
    private static final long serialVersionUID = 114224156570897847L;

    private Long id;
    private String email;           // 发布者邮箱
    private String title;           // 标题
    private String content;         // 文字内容
    private String images;
    private List<String> imageBase64List;   // Base64 列表
    private List<String> imageNameList;     // 原始文件名列表（顺序对应）
    private String tags;            // 标签，逗号分隔
    private Integer status;         // 0草稿 1待审核 2通过 3驳回 4屏蔽
    private String rejectReason;    // 驳回原因
    private Date publishTime;       // 发布时间
    private Date createTime;
    private Date updateTime;
    private Integer isDeleted;

}

