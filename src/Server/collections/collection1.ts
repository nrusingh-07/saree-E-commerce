import Product from '@/models/Product'
import { GetFilter } from './filter'
import { NextRequest } from 'next/server'
import DbConnect from '@/config/DbConfig'

const limit = 32

export const allData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const favouritePicksData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'favourite-picks' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const summerSareesData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'summer-sarees' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const casualStyleData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'casual-style' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const grandHeritageSaleData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'grand-heritage-sale' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const engagementData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'engagement-sarees' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const mehendiData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'mehendi-sarees' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const sangeetData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'sangeet-sarees' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const haldiData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'haldi-sarees' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const banarasiData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'banarasi-saree' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const paithaniData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'paithani-saree' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const kanjivaramData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'kanjivaram-saree' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const patolaData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'patola-sarees' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const organzaData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'organza-saree' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const southSilkData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'south-silk-saree' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const maheshwariSilkData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'maheshwari-silk-saree' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const luxeCollectionData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'luxe-collection' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const dolaSilkData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'dola-silk-saree' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const brassoData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'brasso-saree' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const printedData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'printed-sarees' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const kalamkariData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'kalamkari-sarees' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const ajrakhData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      collections: { $elemMatch: { $eq: 'ajrakh-sarees' } },
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const redSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'red',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const blueSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'blue',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const greenSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'green',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const yellowSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'yellow',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const orangeSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'orange',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const purpleSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'purple',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const pinkSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'pink',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const brownSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'brown',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const graySareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'gray',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const blackSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'black',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const whiteSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'white',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const cyanSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'cyan',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const magentaSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'magenta',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const tealSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'teal',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const limeSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'lime',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const indigoSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'indigo',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const violetSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'violet',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const amberSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'amber',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const multiColorSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      color: 'multi-color',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const silkSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      fabric: 'silk',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const cottonSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      fabric: 'cotton',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const chiffonSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      fabric: 'chiffon',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const georgetteSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      fabric: 'georgette',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const linenSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      fabric: 'linen',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const satinSareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      fabric: 'satin',
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export const celebritySareeData = async (req: NextRequest) => {
  try {
    await DbConnect()
    const { filterObject, page } = GetFilter(req)
    const products = await Product.find({
      ...filterObject,
      isCelebrity: true,
    })
      .skip((page! - 1) * limit)
      .limit(limit)
      .exec()
    const totalProducts = await Product.countDocuments(filterObject)
    return { products, totalProducts }
  } catch (e) {
    console.error(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}
