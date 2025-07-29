function initLiquidCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'liquid-cursor';
    document.body.appendChild(cursor);

    const follower = document.createElement('div');
    follower.className = 'liquid-cursor-follower';
    document.body.appendChild(follower);

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursor, 0.3, { x: mouseX, y: mouseY });
    });

    gsap.ticker.add(() => {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        gsap.set(follower, { x: followerX, y: followerY });
    });

    document.querySelectorAll('.cursor-target, a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, 0.3, { scale: 2.5, filter: 'blur(10px)' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, 0.3, { scale: 1, filter: 'blur(20px)' });
        });
    });
}
