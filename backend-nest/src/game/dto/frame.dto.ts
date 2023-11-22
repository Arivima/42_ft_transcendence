/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   frame.dto.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmarinel <mmarinel@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/11/18 12:04:04 by mmarinel          #+#    #+#             */
/*   Updated: 2023/11/19 11:29:39 by mmarinel         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class PlayerData {
	paddle: {
		w: number,
		h: number
		sx: number,
		sy: number,
		y: number
	}
	score: number
}

export class FrameData {
	canvas: {
		w: number,
		h: number
	}
	ball: {
		radius: number,
		sx: number, sy: number,
		x: number, y: number,
		dx: number, dy: number,
	}
	host: PlayerData
	guest: PlayerData
}

export class FrameDto {
	hostId?: number
	guestID?: number
	seq: number
	data: FrameData
}