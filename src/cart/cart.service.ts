import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { getChangedFields } from "src/utils/fields.check";
import { AddProductToCardDto } from "./cart.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  private async findCartByUserId(userId: string) {
    const cart = await this.prismaService.cart.findUniqueOrThrow({
      where: {
        cartUserId: userId,
      },
    });

    return cart;
  }

  async createNewUserCart(userId: string) {
    const newCart = await this.prismaService.cart.create({
      data: {
        cartUserId: userId,
      },
    });

    return newCart;
  }

  async getAllCartProduct(userId: string) {
    const cart = await this.findCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException();
    }

    const allCartProduct = await this.prismaService.cartProduct.findMany({
      where: {
        cartCartId: cart.cartId,
      },
      include: {
        cartProduct: {
          select: {
            productCode: true,
            productPrice: true,
            productFinalPrice: true,
          },
        },
      },
    });

    return allCartProduct;
  }

  async addProductToCart(newProduct: AddProductToCardDto) {
    const existedProduct = await this.prismaService.cartProduct.findMany({
      where: { productId: newProduct.productId },
    });

    if (existedProduct) {
      const duplicated = existedProduct
        .filter(
          (product) =>
            !Object.keys(
              getChangedFields(
                product.cartProductVariants,
                newProduct.cartProductVariants
              )
            ).length
        )
        ?.find(
          (duplicate) =>
            duplicate.cartCustomerName == newProduct.cartCustomerName
        );

      if (duplicated) {
        const updated = await this.updateProductAmount(
          duplicated.cartProductId,
          newProduct.cartProductAmount + duplicated.cartProductAmount
        );

        return { updated };
      }
    }

    const { ...updateData } = newProduct;

    const newCartProduct = await this.prismaService.cartProduct.create({
      data: { cartCartId: "661e9520d5c458cbcfcf3117", ...updateData },
    });

    return { newCartProduct };
  }

  async updateProductAmount(cartProductId: string, amount: number) {
    const updatedProduct = await this.prismaService.cartProduct.update({
      where: {
        cartProductId: cartProductId,
      },
      data: {
        cartProductAmount: amount,
      },
    });

    return { updatedProduct };
  }

  async deleteCartProduct({ cartProductId }: { cartProductId: string }) {
    const deletedProduct = await this.prismaService.cartProduct.delete({
      where: {
        cartProductId: cartProductId,
      },
    });

    return { deletedProduct };
  }

  async findProductInCartById(productId: string) {
    const isProductInCart = await this.prismaService.cartProduct.findFirst({
      where: {
        productId: productId,
      },
    });

    return isProductInCart ? true : false;
  }
}
