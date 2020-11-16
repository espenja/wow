const minify = require("html-minifier").minify
const uglify = require("uglify-js")
// const cssnano = require("cssnano")

const fs = require("fs-extra")
const path = require("path")

const DIST_DIR = path.resolve(__dirname, "dist")
const SRC_DIR = path.resolve(__dirname, "src")

const copyFile = async (source, dest) => {
    await fs.copy(source, dest)
}

const ensureDistDir = () => {
    if (!fs.pathExistsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR)
    }
}

const copyAndMinifyHtml = () => {
    const htmlContents = fs
        .readFileSync(path.resolve(SRC_DIR, "index.html"))
        .toString()
    const minified = minify(htmlContents, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true,
        useShortDoctype: true
    })
    fs.writeFileSync(path.resolve(DIST_DIR, "index.html"), minified)
}

const copyAndMinifyJs = () => {
    const jsContents = fs
        .readFileSync(path.resolve(SRC_DIR, "script.js"))
        .toString()

    // console.log(jsContents)

    // const minified = uglify.minify()

    // console.log(minified)
    fs.writeFileSync(path.resolve(DIST_DIR, "script.js"), jsContents)
}

const copyAndMinifyCss = () => {
    // const cssContents = fs.readFileSync(path.resolve(SRC_DIR, "style.css"))
    // const minified = cssnano().call()
    // fs.writeFileSync(path.resolve(DIST_DIR, "script.js"), minified)
    fs.copyFileSync(
        path.resolve(SRC_DIR, "style.css"),
        path.resolve(DIST_DIR, "style.css")
    )
}

const start = async () => {
    ensureDistDir()
    copyAndMinifyHtml()
    copyAndMinifyJs()
    copyAndMinifyCss()

    fs.copySync(path.resolve(SRC_DIR, "img"), path.resolve(DIST_DIR, "img"))
    fs.copySync(path.resolve(SRC_DIR, "sound"), path.resolve(DIST_DIR, "sound"))
    // fs.copySync(
    //     path.resolve("./robots.txt"),
    //     path.resolve(DIST_DIR, "robots.txt")
    // )

    console.log("Build completed")
}

start().catch((error) => {
    console.error(error)
    process.exit(1)
})
