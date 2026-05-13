package chat.chatcontent.pojo.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
/**
 * 图文内容表(ContentArticle)实体类
 *
 * @author makejava
 * @since 2026-05-12 17:51:34
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContentVO implements Serializable {
    private static final long serialVersionUID = 114224156570897847L;
    private Long id;
    /**
     * 发布者邮箱
     */
    private String email;
    /**
     * 标题
     */
    private String title;
    /**
     * 文字内容
     */
    private String content;
    /**
     * 多张图片URL，JSON数组：["url1","url2"]
     */
    private String images;
    /**
     * 标签，逗号分隔
     */
    private String tags;
    /**
     * 0草稿 1待审核 2通过 3驳回 4屏蔽
     */
    private Integer status;
    /**
     * 驳回原因
     */
    private String rejectReason;
    /**
     * 发布时间
     */
    private Date publishTime;
    private Date createTime;
    private Date updateTime;
    private Integer isDeleted;
}
