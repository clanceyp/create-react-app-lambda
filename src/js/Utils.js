export const sortGI = ({glycemicIndex:a}, {glycemicIndex:b}) => b-a;

export const setBodyClass = (className, add = true) => {
    if (add) {
        document
            .querySelector('body')
            .classList.add(className);
    } else {
        document
            .querySelector('body')
            .classList.remove(className);
    }
}

export const hash = str => str.split('').reduce((prev, curr) => Math.imul(31, prev) + curr.charCodeAt(0) | 0, 0);