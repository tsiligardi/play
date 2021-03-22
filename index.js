const { getField, login, battle, getScore } = require("./utils")

const main = async() => {
  const name = "tommaso"
  const password = "password"
  try {
    login(name, password)
    const { field } = await getField()
    console.log(field)
    const W = await field[0].length
    const H = await field.length
    console.log("ciao")
    for (let y = 0;y < H;y++) {
      for (let x = 0;x < W;x++) {
        console.log(x, y)
        console.log(await battle(x, y, name, password))
      }
    }
  }   catch (e) {
    console.log(e)
  }
}
main()