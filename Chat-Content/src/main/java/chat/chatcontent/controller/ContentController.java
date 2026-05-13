package chat.chatcontent.controller;


import chat.chatcommon.dto.Page;
import chat.chatcommon.dto.Result;
import chat.chatcontent.feign.RecommendClient;
import chat.chatcontent.pojo.dto.ContentDTO;
import chat.chatcontent.service.ContentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/content")
@Slf4j
public class ContentController {

    @Autowired
    private ContentService contentService;

    @Autowired
    private RecommendClient recommendClient;
    /**
     * 1. 查询自己发布的所有内容
     */
    @PostMapping("/myList")
    public Result<List<ContentDTO>> getMyContent(@RequestBody ContentDTO req) {
        if (req.getEmail() == null || req.getEmail().isEmpty()) {
            return Result.error("邮箱不能为空");
        }
        return Result.success(contentService.selectByEmail(req.getEmail()));
    }

    /**
     * 2. 发布新内容（支持多图 Base64 上传）
     */
    @PostMapping("/publish")
    public Result<Long> publishContent(@RequestBody ContentDTO contentDTO) {
        try {
            if (contentDTO.getEmail() == null || contentDTO.getEmail().isEmpty()) {
                return Result.error("邮箱不能为空");
            }
            if (contentDTO.getTitle() == null || contentDTO.getTitle().isEmpty()) {
                return Result.error("标题不能为空");
            }

            Long contentId = contentService.publishContent(contentDTO);
            return Result.success(contentId);

        } catch (Exception e) {
            log.error("发布内容异常", e);
            return Result.error(500, "发布失败：" + e.getMessage());
        }
    }

    /**
     * 3. 删除内容（逻辑删除）
     */
    @PostMapping("/delete")
    public Result<Integer> deleteContent(@RequestBody ContentDTO contentDTO) {
        if (contentDTO.getId() == null) {
            return Result.error("内容ID不能为空");
        }
        int result = contentService.deleteById(contentDTO.getId());
        return Result.success(result);
    }

    /**
     * 4. 根据匹配模块返回的id，返回相关内容
     */
    @PostMapping("/getById")
    public Result<ContentDTO> getContentById(@RequestBody ContentDTO contentDTO) {
        if (contentDTO.getId() == null) {
            return Result.error("内容ID不能为空");
        }
        ContentDTO content = contentService.selectById(contentDTO.getId());
        if (content == null) {
            return Result.error("内容不存在");
        }
        // 只返回审核通过的内容
        if (content.getStatus() != 2) {
            return Result.error("内容不可见");
        }
        return Result.success(content);
    }

    /**
     * 5. 查看遇见的内容（分页查询审核通过的内容）
     */
    @PostMapping("/meetList")
    public Result<List<ContentDTO>> getMeetContent(@RequestBody Page page) {
        return Result.success(contentService.selectByStatus(page.getPage()));
    }

    /**
     * 统计接口
     */
    @GetMapping("/count")
    public Result<Map<String, Object>> count() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", contentService.countAll());
        stats.put("draft", contentService.countByStatus(0));
        stats.put("pending", contentService.countByStatus(1));
        stats.put("approved", contentService.countByStatus(2));
        stats.put("rejected", contentService.countByStatus(3));
        stats.put("blocked", contentService.countByStatus(4));
        return Result.success(stats);
    }
}