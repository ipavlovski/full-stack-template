import '../styles/style.css'

export default class App {
    prop = 123
    constructor() {
        console.log('Starting.')
    }
}

document.querySelector('input')?.addEventListener('click', () => {
    const date = new Date()
    console.log('Date ISO:', date.toISOString())    
    console.log('something!')
})


declare global { var app: App }
window.app = new App()