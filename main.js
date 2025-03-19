const puppeteer = require('puppeteer');
const { openChatGPTAndInputText } = require('./chatgpt');

const loginLink = "https://www.hackerrank.com/auth/login"
const email = "yariceh950@bankrau.com";
const password = "JAck@1234";
let browserOpenPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized",
        "--enable-clipboard-write",    // Enable clipboard write access
        "--no-sandbox",                // Sometimes necessary to disable sandbox
        "--disable-setuid-sandbox" 
    ],
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 
});

let page;
browserOpenPromise.then(function (browser) {
    console.log("Browser opened");
    let tabOpenPromise = browser.newPage();
    return tabOpenPromise;
}).then(function (newTab) {
    page = newTab;
    let hackerRankOpenPromise = newTab.goto(loginLink);
    return hackerRankOpenPromise;
}).then(function () {
    let emailInput = page.type("input[name='username']", email, { Delay: 50 });
    return emailInput;
}).then(function () {
    let passwordInput = page.type("input[name='password']", password, { Delay: 50 });
    return passwordInput;
}).then(function () {
    // Use partial matching for class names
    return page.click("button[class*='c-cUYkx'][class*='hr-inline-flex']");
}).then(function () {
    console.log("Logged In");

    let algorithmClick = waitAndClick("div[data-automation='algorithms']", page);
    return algorithmClick;
}).then(function () {
    // Wait for the checkbox to be visible
    return page.waitForSelector("input.checkbox-input[value='warmup']", { visible: true, timeout: 5000 });
})
.then(function () {
    // Click the checkbox (use force: true if needed)
    return page.click("input.checkbox-input[value='warmup']", { force: true });
})
.then(function () {
    console.log("Checkbox for Warm Up clicked");
}).then(function () {
    let allQuestions = page.$$('.ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled');
    return allQuestions
}).then(function (allQuestions) {
    // let allQuestionsPromise = [];
    // for (let i = 0; i < allQuestions.length; i++) {
    //     let quesLink = allQuestions[i];
    //     let quesLinkPromise = questionSolver(quesLink);
    //     allQuestionsPromise.push(quesLinkPromise);
    // }
//     let pendingPromise = Promise.all(allQuestionsPromise);
//     return pendingPromise;
// }).then(function () {
//     console.log("All questions solved");
// }).catch(function (err) {
//     console.log(err);
 let quesitionSolve = questionSolver(allQuestions[0]);
 return quesitionSolve;
})

function waitAndClick(selector, cpage) {
    return new Promise(function (resolve, reject) {
        let waitForElementPromise = cpage.waitForSelector(selector);
        waitForElementPromise
            .then(function () {
                let clickPromise = cpage.click(selector);
                return clickPromise;
            }).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            })
    })
}

function questionSolver(quesLink) {
    return new Promise(function (resolve, reject) {
        let questionClick = quesLink.click();
        questionClick.then(function () {
            let editorFocus = waitAndClick(".monaco-editor.no-user-select.vs", page);
            return editorFocus;
        }).then(function () {
            // Now select all text and copy it
            let selectAndCopy = page.evaluate(() => {
                // Ensure Monaco editor is focused
                const editor = document.querySelector('.monaco-editor.no-user-select.vs');
                if (editor) {
                    // Select all text in the editor
                    const model = editor.querySelector('.view-lines'); // This targets the actual editor content
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(model);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    // Use document.execCommand("copy") to copy the selected text
                    document.execCommand("copy");

                    return 'Text copied!';
                }
                return 'Editor not found';
            });
            return selectAndCopy;
        }).then(function (result) {
            console.log(result);
              // After copying, call the function to open ChatGPT and input the copied text
            //   openChatGPTAndInputText(page);
            resolve(); // Resolve when done
        }).catch(function (err) {
            reject(err);
        });
    });
}