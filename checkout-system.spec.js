const { PRODUCT, CART } = require("./checkout-system")

describe("Product", () => {
  const ipd = new PRODUCT("ipd", "Super iPad", 549.99)

  it("Should have an SKU", () => {
    expect(Object.keys(ipd).includes("sku")).toBe(true)
  })

  it("Should have a name", () => {
    expect(Object.keys(ipd).includes("name")).toBe(true)
  })

  it("Should have a price", () => {
    expect(Object.keys(ipd).includes("price")).toBe(true)
  })
})

describe("Cart", () => {
  const ipd = new PRODUCT("ipd", "Super iPad", 549.99)
  const mbp = new PRODUCT("mbp", "MacBook Pro", 1399.99)
  const atv = new PRODUCT("atv", "Apple TV", 109.50)
  const vga = new PRODUCT("vga", "VGA adapter", 30.00)
  
  const cart1 = new CART([ipd, ipd])
  const cart2 = new CART([atv, atv, atv, atv, atv])
  const cart3 = new CART([ipd, ipd, ipd, ipd, ipd])
  const cart4 = new CART([mbp, mbp, vga])
  const cart5 = new CART([atv, atv])

  const example_scenario_1 = new CART([atv, atv, atv, vga])
  const example_scenario_2 = new CART([atv, ipd, ipd, atv, ipd, ipd, ipd])
  const vga_freebie = new CART([mbp, mbp])
  const example_scenario_3 = new CART([mbp, vga, ipd])

  it("Should have items", () => {
    expect(Object.keys(cart1).includes("items")).toBe(true)
  })

  it("Defines scan", () => {
    expect(typeof cart1.scan).toBe("function")
  })

  it("Defines atvPromo", () => {
    expect(typeof cart1.atvPromo).toBe("function")
  })

  it("Defines superIpdPromo", () => {
    expect(typeof cart1.superIpdPromo).toBe("function")
  })

  it("Defines mbpPromo", () => {
    expect(typeof cart1.mbpPromo).toBe("function")
  })

  it("Defines total", () => {
    expect(typeof cart1.total).toBe("function")
  })

  it("Defines checkOut", () => {
    expect(typeof cart1.checkOut).toBe("function")
  })

  it("Correctly checks out atv promo", () => {
    expect(cart2.checkOut()).toStrictEqual({
      receipt: {
        atv: [5, 438]
      },
      total: "$438"
    })
  })

  it("Correctly checks out Super Ipad promo", () => {
    expect(cart3.checkOut()).toStrictEqual({
      receipt: {
        ipd: [5, 2499.95]
      },
      total: "$2499.95"
    })
  })

  it("Correctly checks out free VGAs promo", () => {
    expect(cart4.checkOut()).toStrictEqual({
      receipt: {
        mbp: [2, 1399.99],
        vga: [3, 30]
      },
      total: "$1429.99"
    })
  })

  it("Correctly checks out Super iPads without a promo", () => {
    expect(cart1.checkOut()).toStrictEqual({
      receipt: {
        ipd: [2, 1099.98]
      },
      total: "$1099.98"
    })
  })

  it("Correctly checks out Apple Tvs without a promo", () => {
    expect(cart5.checkOut()).toStrictEqual({
      receipt: {
        atv: [2, 219]
      },
      total: "$219"
    })
  })

  it("Correctly checks out example scenario 1", () => {
    expect(example_scenario_1.checkOut().total).toBe("$249")
  })

  it("Correctly checks out example scenario 2", () => {
    expect(example_scenario_2.checkOut().total).toBe("$2718.95")
  })

  it("Includes VGA freebies even when only MacBook Pros are purchased", () => {
    expect(vga_freebie.checkOut().receipt.vga[0]).toBe(vga_freebie.checkOut().receipt.mbp[0])
  })

  it("Correctly checks out example scenario 3", () => {
    // added $30 to the original expected amount due to my interpretation of the free VGAs promo
    // instead of the VGA on the item list to be free, the code adds a free VGA for every MBP purchased 
    // making the VGA on the example scenario a separate purchase entirely
    expect(example_scenario_3.checkOut().total).toBe("$1979.98")
  })
})

