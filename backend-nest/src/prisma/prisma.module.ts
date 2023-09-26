/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   prisma.module.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/09/25 11:36:38 by mmarinel          #+#    #+#             */
/*   Updated: 2023/09/25 11:46:45 by mmarinel         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports : [PrismaService]
})
export class PrismaModule {}
