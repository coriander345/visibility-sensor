// Copyright (C) 2022 Intel Corporation
//
// SPDX-License-Identifier: MIT
import React, { cloneElement, useEffect, useRef } from 'react';

interface Props {
    onChange(): void;
    children: any;
    containment: Element | null;
}

const VisibilitySensor: React.FC<Props> = (props) => {
    const { onChange, children, containment } = props;

    if (!children || !containment) return null;

    const ref = useRef<any>(null);
    useEffect(() => {
        if (ref && ref.current) {
            const observer = new IntersectionObserver(
                (entries): void => {
                    const [item] = entries;

                    if (!item.isIntersecting || !item.rootBounds) return;
                    const rootBoundsRight = item.rootBounds.right;
                    const targetBoundsLeft = item.boundingClientRect.left;
                    if (rootBoundsRight >= targetBoundsLeft) {
                        onChange();
                        observer.unobserve(item.target);
                    }
                },
                {
                    root: containment,
                    rootMargin: '100px',
                    threshold: 0.5,
                },
            );

            if (ref && ref.current) {
                observer.observe(ref.current);
                // then put it to extra controls if parent height is not enough
            }

            return () => {
                observer.disconnect();
            };
        }

        return () => {};
    }, []);

    return <>{cloneElement(children, { ref })}</>;
};

export default React.memo(VisibilitySensor);
