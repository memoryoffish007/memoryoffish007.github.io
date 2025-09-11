mixins.highlight = {
    data() {
        return { copying: false };
    },
    created() {
        hljs.configure({ ignoreUnescapedHTML: true });
        this.renderers.push(this.highlight);
    },
    methods: {
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        highlight() {
            let codes = document.querySelectorAll("pre");
            for (let i of codes) {
                let code = i.textContent;
                // 获取语言标识符，并处理可能的'line'错误
                let language = [...i.classList, ...i.firstChild.classList][0] || "plaintext";
                // 防止'line'语言标识符导致的错误
                if (language === 'line') {
                    language = 'plaintext';
                }
                let highlighted;
                try {
                    highlighted = hljs.highlight(code, { language }).value;
                } catch (e) {
                    console.warn("Failed to highlight code: ", e);
                    highlighted = code;
                }
                i.innerHTML = `
                <div class="code-content hljs">${highlighted}</div>
                <div class="language">${language}</div>
                <div class="copycode">
                    <i class="fa-solid fa-copy fa-fw"></i>
                    <i class="fa-solid fa-check fa-fw"></i>
                </div>
                `;
                let content = i.querySelector(".code-content");
                // 避免lineNumbersBlock函数导致的'line'语言错误
                try {
                    if (hljs.lineNumbersBlock) {
                        hljs.lineNumbersBlock(content, { singleLine: true });
                    }
                } catch (e) {
                    console.warn("Failed to apply line numbers: ", e);
                }
                let copycode = i.querySelector(".copycode");
                copycode.addEventListener("click", async () => {
                    if (this.copying) return;
                    this.copying = true;
                    copycode.classList.add("copied");
                    await navigator.clipboard.writeText(code);
                    await this.sleep(1000);
                    copycode.classList.remove("copied");
                    this.copying = false;
                });
            }
        },
    },
};
