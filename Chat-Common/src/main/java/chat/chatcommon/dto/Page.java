package chat.chatcommon.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Page {

    /**
     * 当前页码（从1开始）
     */
    private Integer page = 1;

    /**
     * 每页大小
     */
    private Integer size = 10;

    /**
     * 获取分页偏移量（用于 MySQL LIMIT）
     */
    public Integer getOffset() {
        return (page - 1) * size;
    }
}