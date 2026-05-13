package chat.chatcontent.mapper;

import chat.chatcontent.pojo.dto.ContentDTO;
import chat.chatcontent.pojo.vo.ContentVO;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface ContentMapper {

    /**
     * 插入内容
     */
    @Insert("INSERT INTO content_article (email, title, content, images, tags, status, reject_reason, " +
            "publish_time, create_time, update_time, is_deleted) " +
            "VALUES (#{email}, #{title}, #{content}, #{images}, #{tags}, #{status}, #{rejectReason}, " +
            "#{publishTime}, NOW(), NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertContent(ContentDTO contentDTO);

    /**
     * 根据ID查询
     */
    @Select("SELECT * FROM content_article WHERE id = #{id} AND is_deleted = 0")
    ContentDTO selectById(@Param("id") Long id);

    /**
     * 分页查询
     */
    @Select("SELECT * FROM content_article WHERE is_deleted = 0 ORDER BY create_time DESC LIMIT #{offset}, #{limit}")
    List<ContentDTO> selectByPage(@Param("offset") int offset, @Param("limit") int limit);

    /**
     * 逻辑删除
     */
    @Update("UPDATE content_article SET is_deleted = 1, update_time = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);

    /**
     * 动态更新
     */
    @Update({
            "<script>",
            "UPDATE content_article",
            "<set>",
            "   <if test='title != null and title != \"\"'>title = #{title},</if>",
            "   <if test='content != null and content != \"\"'>content = #{content},</if>",
            "   <if test='images != null'>images = #{images},</if>",
            "   <if test='tags != null'>tags = #{tags},</if>",
            "   <if test='status != null'>status = #{status},</if>",
            "   <if test='rejectReason != null'>reject_reason = #{rejectReason},</if>",
            "   <if test='publishTime != null'>publish_time = #{publishTime},</if>",
            "   update_time = NOW()",
            "</set>",
            "WHERE id = #{id}",
            "</script>"
    })
    int updateContentSelective(ContentVO contentVO);

    /**
     * 更新审核状态
     */
    @Update("UPDATE content_article SET status = #{status}, reject_reason = #{rejectReason}, update_time = NOW() WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") Integer status, @Param("rejectReason") String rejectReason);

    /**
     * 统计总数
     */
    @Select("SELECT COUNT(*) FROM content_article WHERE is_deleted = 0")
    int countAll();

    /**
     * 按状态统计
     */
    @Select("SELECT COUNT(*) FROM content_article WHERE status = #{status} AND is_deleted = 0")
    int countByStatus(@Param("status") int status);


    @Select("<script>" +
            "SELECT * FROM content_article WHERE is_deleted = 0 " +
            "AND id IN " +
            "<foreach collection='idList' item='id' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<ContentDTO> selectByIdList(@Param("idList") List<Integer> idList);

    /**
     * 按标签分组统计
     */
    @Select("SELECT tags, COUNT(*) as count FROM content_article WHERE is_deleted = 0 GROUP BY tags")
    List<Map<String, Object>> countGroupByTags();

    /**
     * 按邮箱查询用户内容
     */

    /**
     * 按状态分页查询（用于审核）
     */
    @Select("SELECT * FROM content_article WHERE status = #{status} AND is_deleted = 0 ORDER BY create_time ASC LIMIT #{offset}, #{limit}")
    List<ContentDTO> selectByStatus(@Param("status") int status, @Param("offset") int offset, @Param("limit") int limit);

    @Select("select * from content_article where email=#{email}")
    List<ContentDTO> selectByEmail(String email);
}