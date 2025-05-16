# JavaScript 调试绕过测试平台

[[English](README.md) | 中文 (当前)]

## 在线体验

🔗 **[https://jsrei.github.io/js-debugger-bypass-goat/](https://jsrei.github.io/js-debugger-bypass-goat/)**

![Star me on GitHub](https://img.shields.io/github/stars/JSREI/js-debugger-bypass-goat?style=social)

这是一个用于测试JavaScript反调试绕过技术的在线平台。该平台提供了多个测试案例，帮助开发者和安全研究人员测试和验证JavaScript调试器绕过工具的有效性。

## 特点

- 多样化的测试案例
- 实时验证功能
- 清晰的难度分级
- 详细的案例说明
- 代码可复制功能
- 多语言支持（中文/英文）

## 测试用例

1. 基础 debugger 语句（简单）
2. 条件触发 debugger（中等）
3. 混淆代码中的 debugger（困难）
4. 定时器 debugger（中等）
5. 事件监听器 debugger（困难）
6. 代理对象 debugger（困难）

## 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/JSREI/js-debugger-bypass-goat.git
```

2. 进入项目目录：
```bash
cd js-debugger-bypass-goat
```

3. 使用任意HTTP服务器运行项目，例如：
```bash
python -m http.server 8080
```

4. 在浏览器中访问：`http://localhost:8080`

## 相关项目

- [js-debugger-bypass](https://github.com/JSREI/js-debugger-bypass) - JavaScript调试器绕过工具

## 贡献

欢迎提交Pull Request来添加新的测试用例或改进现有用例。

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件 