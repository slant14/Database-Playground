1. **Header area**  
   - Full‑width horizontal strip at the top  
   - Background: smooth vertical gradient (choose two harmonious colors)  
   - At the bottom edge of the header, a 1px high horizontal divider in bright green (#00FF00)

2. **Main content container**  
   - Background: light gray fill (#F5F5F5)  
   - Centered card (max-width ~800px, with padding and subtle shadow)

3. **Avatar section (left side of card)**  
   - Circular placeholder, 120×120 px, centered vertically in the card  
   - Border: 2px solid gray  
   - Below avatar, a block for user info:
     - Name (h2), status/role (small subtitle), and a short bio line
     - Layout: text centered under the avatar

4. **Right side of card**  
   - Top: a gauge component showing “Your grade: X.Y” with an arc from 1 to 5 and a needle/indicator
     - You can use a simple SVG or canvas to draw the arc and pointer
   - Below gauge: an empty rectangular placeholder block (full width of right column, height ~100px) for future content

5. **Footer of card**  
   - A small text “#hex” aligned to the bottom-right corner of the card

**Additional requirements:**  
- Use CSS Flexbox or Grid for layout  
- Make the design mobile‑friendly (avatar stacks above gauge on narrow screens)  
- Use semantic HTML tags  
- Keep the code clean and well‑commented

Output all necessary files (HTML, CSS, and JS or JSX) in a single code block or project structure.