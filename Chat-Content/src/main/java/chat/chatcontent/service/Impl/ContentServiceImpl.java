package chat.chatcontent.service.Impl;

import chat.chatcommon.util.ImageUtil;
import chat.chatcontent.mapper.ContentMapper;
import chat.chatcontent.pojo.dto.ContentDTO;
import chat.chatcontent.service.ContentService;

import chat.chatoss.service.OssUploadService;
import chat.chatoss.util.OSSUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ContentServiceImpl implements ContentService {

    @Autowired
    private ContentMapper contentMapper;

    @Autowired
    private OssUploadService ossUploadService;  // 直接注入 OSS 服务

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Long publishContent(ContentDTO contentDTO) {
        // 1. 处理多图上传
        List<String> imageUrls = new ArrayList<>();
        if (contentDTO.getImageBase64List() != null && !contentDTO.getImageBase64List().isEmpty()) {
            for (int i = 0; i < contentDTO.getImageBase64List().size(); i++) {
                String base64 = contentDTO.getImageBase64List().get(i);

                // 获取用户上传的原始文件名
                String originalFileName = contentDTO.getImageNameList().get(i);

                // 提取扩展名
                String suffix = "";
                if (originalFileName != null && originalFileName.contains(".")) {
                    suffix = originalFileName.substring(originalFileName.lastIndexOf("."));
                } else {
                    suffix = ".jpg";
                }

                // 生成唯一文件名（保留原始扩展名）
                String uniqueFileName = UUID.randomUUID().toString().replace("-", "") + suffix;
                byte[] bytes = OSSUtil.uploadBase64ToOss(base64, uniqueFileName);
                // 上传到 OSS
                String imageUrl = ossUploadService.upload(uniqueFileName, bytes);
                imageUrls.add(imageUrl);
            }
        }


        // 3. 设置默认值
        contentDTO.setStatus(1);      // 默认待审核
        contentDTO.setIsDeleted(0);
        contentDTO.setCreateTime(new Date());
        contentDTO.setUpdateTime(new Date());

        // 4. 插入数据库
        contentMapper.insertContent(contentDTO);
        return contentDTO.getId();
    }

    @Override
    public List<ContentDTO> selectByEmail(String email) {
        return contentMapper.selectByEmail(email);
    }

    @Override
    public ContentDTO selectById(Long id) {
        return contentMapper.selectById(id);
    }

    @Override
    public int deleteById(Long id) {
        return contentMapper.deleteById(id);
    }

    @Override
    public List<ContentDTO> selectByStatus(int status, int offset, int limit) {
        return contentMapper.selectByStatus(status, offset, limit);
    }

    @Override
    public int countAll() {
        return contentMapper.countAll();
    }

    @Override
    public int countByStatus(int status) {
        return contentMapper.countByStatus(status);
    }
}