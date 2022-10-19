class PRODUCT {
    constructor(sku, name, price) {
        this.sku = sku
        this.name = name
        this.price = price
    }
}

class CART {
    constructor(items) {
        this.items = items
    }

    scan() {
        const scannedItems = {}

        this.items.forEach(({sku, price})=> {
            scannedItems[sku] = [
                (parseInt(scannedItems[sku]) || 0) + 1,
                price
            ]
        })

        return scannedItems
    }

    // this section contains the promos that may be applied to specific products
    atvPromo({atv}) {
        if (!atv) return 0
        const atvsToPay = (Math.floor(atv[0] / 3) * 2) + atv[0] % 3
        return atv[1] *= atvsToPay
    }

    superIpdPromo({ipd}) {
        if(!ipd) return 0
        if(ipd[0] >= 5) {
            ipd[1] = 499.99
        }
        return ipd[1] *= ipd[0]
    }

    mbpPromo(scannedItems) {
        if(!scannedItems.mbp) return 0
        if(scannedItems.vga) {
            scannedItems.vga[0] += scannedItems.mbp[0]
        } else {
            scannedItems["vga"] = [
                scannedItems.mbp[0],
                0
            ]
        }
    }
    // end of product specific promo section

    total(scannedItems) {
        const total = []
        Object.values(scannedItems).forEach(each => {
            total.push(each[1])
        })
        return total.reduce((acc, sum) => {
            return acc + sum
        }, 0)
    }

    checkOut() {
        const scannedItems = this.scan()
        // this section invokes product specific promos 
        this.atvPromo(scannedItems)
        this.superIpdPromo(scannedItems)
        scannedItems.vga ? scannedItems.vga[1] *= scannedItems.vga[0] : null
        this.mbpPromo(scannedItems)
        // end of produc specific promo invocation

        return {
            receipt: scannedItems,
            total: `$${this.total(scannedItems)}`
        }
    }
}

module.exports = {
    PRODUCT,
    CART
}