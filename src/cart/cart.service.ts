import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { getChangedFields } from "src/utils/fields.check";
import { AddProductToCardDto } from "./cart.dto";
import { ProductService } from "src/product/product.service";

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

    const allCartProduct = await this.prismaService.cart.findUnique({
      where: {
        cartUserId: userId,
      },
      include: {
        cartProducts: {
          include: {
            cartProduct: {
              select: {
                productCode: true,
                productPrice: true,
                productFinalPrice: true,
              },
            },
          },
        },
      },
    });

    return allCartProduct.cartProducts;
  }

  async addProductToCart(newProduct: AddProductToCardDto, userId: string) {
    const cart = await this.findCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException();
    }

    const existedProducts = await this.findProductInCartById(
      newProduct.productId,
      userId
    );

    if (existedProducts) {
      const duplicated = existedProducts.cartProducts
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

    const newCartProduct = await this.prismaService.cart.update({
      where: {
        cartId: cart.cartId,
      },
      data: {
        cartProducts: {
          create: [updateData],
        },
      },
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

  async deleteCartProduct(cartProductId: string, userId: string) {
    const cartProduct = await this.prismaService.cart.findUnique({
      where: {
        cartUserId: userId,
      },
      include: {
        cartProducts: {
          where: {
            cartProductId: cartProductId,
          },
        },
      },
    });

    if (!cartProduct.cartProducts) {
      throw new NotFoundException();
    }

    const deletedProduct = await this.prismaService.cartProduct.delete({
      where: {
        cartProductId: cartProductId,
      },
    });

    return { deletedProduct };
  }

  async findProductInCartById(productId: string, userId: string) {
    const existedProducts = await this.prismaService.cart.findUnique({
      where: {
        cartUserId: userId,
      },
      include: {
        cartProducts: {
          where: {
            productId: productId,
          },
        },
      },
    });

    return existedProducts ? existedProducts : false;
  }
}
