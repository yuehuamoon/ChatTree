package chat.chatcommon.entity;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
/**
 * 私聊消息表(ChatMessage)实体类
 *
 * @author makejava
 * @since 2026-05-12 17:51:52
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage implements Serializable {
    private static final long serialVersionUID = 357976611660963489L;
    private Long id;
    /**
     * 发送者邮箱
     */
    private String fromEmail;
    /**
     * 接收者邮箱
     */
    private String toEmail;
    /**
     * 文字内容
     */
    private String content;
    /**
     * 图片URL
     */
    private String imgUrl;
    /**
     * 1文字 2图片
     */
    private Integer type;
    /**
     * 0未撤回 1已撤回
     */
    private Integer isRecall;
    private Date createTime;
}
