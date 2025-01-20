// copy selected transactions to clipboard
function handleClick() {
    const transactionContainers = document.getElementsByClassName("transaction-detail__container");

    let toBeCopy = '';
    for (let i = transactionContainers.length - 1; i >= 0; i--) {
        // console.log('LOGGER: transaction found!' + i);
        bar = transactionContainers[i].parentElement.parentElement.parentElement.previousSibling;
        transAmount = bar.lastChild.lastChild.lastChild.textContent;

        // throw out positive values
        if (transAmount.substring(0,1) == '+') {
            continue;
        }
        transAmount = transAmount.substring(1)

        // handle if charge is still pending
        if (bar.parentElement.firstChild.firstChild.firstChild.textContent == 'PENDING') {
            transName = bar.lastChild.previousSibling.lastChild.lastChild.textContent.substring(7);
            transDate = transactionContainers[i].firstChild.firstChild.lastChild.firstChild.nextSibling.firstChild.lastChild.textContent;
        } else {
            transName = bar.lastChild.previousSibling.lastChild.lastChild.textContent;
            transDate = transactionContainers[i].firstChild.firstChild.lastChild.firstChild.nextSibling.nextSibling.firstChild.lastChild.textContent;
        }

        // console.log('LOGGER:',transName,transAmount,transDate);

        // spreadsheet format
        toBeCopy += transDate + '\t' + transAmount + '\t' + transName + '\n';
    };
    navigator.clipboard.writeText(toBeCopy);
}

// wait till the selector (header-wrapper div) shows up to inject
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function injectButton() {
    waitForElm("div[class='header-wrapper']").then((elm) => {
        const activationButton = document.createElement("button");
        activationButton.textContent = "Copy Selected";
        activationButton.className = "usb-button button--primary button--medium"
        activationButton.addEventListener("click", handleClick);
        elm.insertAdjacentElement("afterbegin",activationButton);
        // console.log('LOGGER: Logger Button Placed');
    });
}

// console.log('LOGGER: Hello From The Logger');

// console.log('LOGGER: first load hash:',window.location.hash)
if (window.location.hash === "#/account-dashboard") {
    // console.log('LOGGER: ALREADY THE CORRECT HASH! DUH');
    injectButton();
}
  
let lastHash = window.location.hash;

// every half second, check hash
setInterval(() => {
    if (window.location.hash !== lastHash) {
        lastHash = window.location.hash;
        // console.log('LOGGER: new hash:',window.location.hash)
        if (window.location.hash === "#/account-dashboard") {
            // console.log('LOGGER: UPDATED TO THE CORRECT HASH! WHAAAT');
            injectButton();
        }
    }
}, 500);
