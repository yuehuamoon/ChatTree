package chat.chatcontent.service;


import chat.chatcontent.pojo.dto.ContentDTO;

import java.util.List;

public interface ContentService {

    /** 发布内容（支持多图 Base64 上传） */
    Long publishContent(ContentDTO contentDTO);

    /** 根据邮箱查询用户所有内容 */
    List<ContentDTO> selectByEmail(String email);

    /** 根据ID查询内容 */
    ContentDTO selectById(Long id);

    /** 逻辑删除 */
    int deleteById(Long id);

    /** 查看遇见内容 */
    List<ContentDTO> selectByRecommend(ContentDTO contentDTO);

    List<ContentDTO> getRecommend(ContentDTO contentDTO);

    int deleteRecommend(ContentDTO contentDTO, Long index);

    /** 统计总数 */
    int countAll();

    /** 按状态统计 */
    int countByStatus(int status);
}