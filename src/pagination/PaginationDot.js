import React, { PureComponent } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';
import styles from './Pagination.style';

export default class PaginationDot extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			animColor: new Animated.Value(0),
			animOpacity: new Animated.Value(0),
			animTransform: new Animated.Value(0)
		};
	}

	componentDidMount() {
		if (this.props.active) {
			this._animate(1);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.active !== this.props.active) {
			this._animate(nextProps.active ? 1 : 0);
		}
	}

	_animate(toValue = 0) {
		const { animColor, animOpacity, animTransform } = this.state;

		const commonProperties = {
			toValue,
			duration: 250,
			isInteraction: false,
			useNativeDriver: !this._shouldAnimateColor
		};

		let animations = [
			Animated.timing(animOpacity, {
				easing: Easing.linear,
				...commonProperties
			}),
			Animated.spring(animTransform, {
				friction: 4,
				tension: 50,
				...commonProperties
			})
		];

		if (this._shouldAnimateColor) {
			animations.push(
				Animated.timing(animColor, {
					easing: Easing.linear,
					...commonProperties
				})
			);
		}

		Animated.parallel(animations).start();
	}

	get _shouldAnimateColor() {
		const { color, inactiveColor } = this.props;
		return color && inactiveColor;
	}

	render() {
		const { animColor, animOpacity, animTransform } = this.state;
		const {
			active,
			activeOpacity,
			carouselRef,
			color,
			containerStyle,
			inactiveColor,
			inactiveStyle,
			inactiveOpacity,
			inactiveScale,
			index,
			style,
			tappable
		} = this.props;

		const animatedStyle = {
			opacity: animOpacity.interpolate({
				inputRange: [0, 1],
				outputRange: [inactiveOpacity, 1]
			}),
			transform: [
				{
					scale: animTransform.interpolate({
						inputRange: [0, 1],
						outputRange: [inactiveScale, 1]
					})
				}
			]
		};
		const animatedColor = this._shouldAnimateColor
			? {
					backgroundColor: animColor.interpolate({
						inputRange: [0, 1],
						outputRange: [inactiveColor, color]
					})
			  }
			: {};

		const dotContainerStyle = [
			styles.sliderPaginationDotContainer,
			containerStyle || {}
		];

		const dotStyle = [
			styles.sliderPaginationDot,
			style || {},
			(!active && inactiveStyle) || {},
			animatedStyle,
			animatedColor
		];

		const onPress = tappable
			? () => {
					carouselRef &&
						carouselRef._snapToItem(carouselRef._getPositionIndex(index));
			  }
			: undefined;

		return (
			<TouchableOpacity
				style={dotContainerStyle}
				activeOpacity={tappable ? activeOpacity : 1}
				onPress={onPress}>
				<Animated.View style={dotStyle} />
			</TouchableOpacity>
		);
	}
}
