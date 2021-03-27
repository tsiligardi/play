const { getField, login, fire, getScore } = require("./utils")

const main = async() => {
  const link = "http://93.42.249.207:8080/"
  const name = "tommaso"
  const password = "password"
  try {
    login(link, name, password)
    const { field } = await getField(link)
    const W = await field[0].length
    const H = await field.length
    for (let y = 0;y < H;y++) {
      for (let x = 0;x < W;x++) {
        console.log(await fire(link, x, y, name, password))
      }
    }
  }   catch (e) {
    console.log(e)
  }
}
main()