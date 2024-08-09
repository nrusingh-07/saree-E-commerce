import Impression from '@/models/Impression'

export const addImpression = async (userId: string, productId: string) => {
  try {
    const date = new Date()

    const impression = await Impression.findOne({
      userId: userId,
      productId: productId,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDay(),
    })

    if (impression) return

    await Impression.create({
      userId: userId,
      productId: productId,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDay(),
      date: date,
    })

    return
  } catch (e) {
    console.log(e)
  }
}
