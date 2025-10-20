namespace Application.DTOs;

public class FileUploadDto
{
    public string Url { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
}
