/* Smith Recipe Book — family handwriting transcriptions and a published naan recipe.
 * The six family recipes reflect confirmed notes. No invented yields or measurements.
 * 'yieldUnknown' means an entire batch, NOT a known serving count.
 * For naan, Classic is the base; Garlic Butter and Cheese are selectable versions.
 * Original source notes are included on each recipe.
 */
window.FAMILY_RECIPES = [
  {
    "id": "family-quick-zucchini-bread",
    "title": "Quick Zucchini Bread",
    "category": "Breads & Baking",
    "time": "60 min baking",
    "servings": 2,
    "yieldUnit": "loaves",
    "source": "Handwritten Smith family recipe. Measurements and oven temperature confirmed from the original note.",
    "sourceUrl": "",
    "description": "A two-loaf zucchini quick bread with cinnamon, vanilla, and optional nuts or raisins.",
    "ingredients": [
      "3 cups all-purpose flour",
      "1¼ tsp salt",
      "1 tsp baking soda",
      "¼ tsp baking powder",
      "1 tsp cinnamon",
      "1 cup vegetable oil",
      "2 cups sugar",
      "3 eggs",
      "2 cups shredded zucchini",
      "½ tsp ground lemon peel",
      "2 tsp vanilla",
      "½ cup chopped nuts or raisins (optional)"
    ],
    "steps": [
      "Sift together flour, salt, baking soda, baking powder, and cinnamon. Set aside.",
      "Mix the oil, sugar, and eggs together.",
      "Mix in the shredded zucchini. Add the vanilla after blending well.",
      "Stir in the sifted dry ingredients, then add the nuts or raisins, if using.",
      "Divide the batter between two loaf pans and bake at 350°F for 60 minutes, as written on the original card."
    ],
    "tips": "Original handwritten recipe yields 2 loaves. The card does not specify loaf-pan dimensions, pan preparation, or a doneness test; no pan size has been assumed. The optional line reads '½ cup chopped nuts or raisins.'"
  },
  {
    "id": "family-sugar-cookies-double",
    "title": "Family Sugar Cookies (Double Batch)",
    "category": "Cookies & Desserts",
    "time": "about 10 min baking per batch",
    "servings": 1,
    "yieldUnit": "batch",
    "yieldUnknown": true,
    "source": "Handwritten Smith family sugar-cookie card marked 'Double'; the listed amounts are already doubled.",
    "sourceUrl": "",
    "description": "Classic family sugar cookies from a handwritten double-batch ingredient list.",
    "ingredients": [
      "1½ cups flour",
      "½ tsp baking powder",
      "½ tsp salt",
      "½ tsp baking soda",
      "½ cup shortening",
      "½ cup sugar",
      "1 egg",
      "2 tsp milk",
      "1 tsp vanilla"
    ],
    "steps": [
      "The handwritten recipe lists the ingredients but does not specify how to combine the dough, shape the cookies, or whether to chill it. Those instructions remain unconfirmed.",
      "Bake at 350°F until lightly browned, approximately 10 minutes, as written."
    ],
    "tips": "The word 'Double' is part of the original card; these quantities are already doubled, so do not automatically double them again. Cookie count, mixing technique, and shaping directions were not written on the card."
  },
  {
    "id": "family-meatballs",
    "title": "Family Meatballs",
    "category": "Main Dishes",
    "time": "45 min if baked",
    "servings": 1,
    "yieldUnit": "batch",
    "yieldUnknown": true,
    "source": "Handwritten Smith family meatball recipe; ground-beef percentage and bread preparation confirmed.",
    "sourceUrl": "",
    "description": "Homestyle beef meatballs with Parmesan, oregano, parsley, and moistened bread.",
    "ingredients": [
      "1 lb ground chuck (80% lean)",
      "1 tsp garlic",
      "1 tsp oregano",
      "1 tbsp parsley",
      "2 tbsp Parmesan cheese",
      "1 egg",
      "3 slices dry bread",
      "Salt and pepper, to taste"
    ],
    "steps": [
      "Remove the crusts from the dry bread. Wet the bread, then squeeze out the excess water.",
      "Combine the ground chuck with garlic, oregano, parsley, Parmesan, egg, prepared bread, salt, and pepper. Shape into meatballs.",
      "Either fry the meatballs until cooked through, or place them on foil and bake at 350°F for 45 minutes, as the handwritten card instructs."
    ],
    "tips": "For food safety, ground-beef meatballs should reach 160°F in the center. The original does not specify the number of meatballs, the kind of garlic, or a frying duration; those are left unspecified."
  },
  {
    "id": "family-black-bean-corn-salad",
    "title": "Black Bean and Corn Salad",
    "category": "Salads & Sides",
    "time": "Prep and chill (time unspecified)",
    "servings": 8,
    "source": "Handwritten Smith family recipe card; green-onion quantity confirmed.",
    "sourceUrl": "",
    "description": "A make-ahead salad with black beans, sweet corn, peppers, Monterey Jack, and picante dressing.",
    "ingredients": [
      "1 can (15 oz) black beans, rinsed and drained",
      "4 oz Monterey Jack cheese, cut into ¼-inch cubes",
      "1 can (8¾ oz) whole-kernel corn, drained",
      "¼ cup sliced green onions, including tops",
      "¾ cup thinly sliced celery",
      "1 small sweet red pepper, diced",
      "¾ cup picante sauce",
      "2 tbsp olive oil (optional)",
      "2 tbsp lemon juice",
      "½–1 tsp ground cumin",
      "1 garlic clove, minced"
    ],
    "steps": [
      "Prepare the beans, corn, cheese, onions, celery, sweet red pepper, and minced garlic as listed.",
      "Combine everything with the picante sauce, optional olive oil, lemon juice, and ground cumin.",
      "Cover and chill before serving."
    ],
    "tips": "The original says 'Cover + chill, 8 servings (we usually double the recipe).' No chilling duration is specified."
  },
  {
    "id": "family-bulgogi-korean-bbq-beef",
    "title": "Bulgogi (Korean-Style BBQ Beef)",
    "category": "Main Dishes",
    "time": "Overnight marinating; cook time unspecified",
    "servings": 1,
    "yieldUnit": "batch",
    "yieldUnknown": true,
    "source": "Handwritten Smith family bulgogi recipe, shown on two pages; reserved-marinade instructions confirmed.",
    "sourceUrl": "",
    "description": "Thinly sliced sirloin marinated overnight with soy sauce, sesame oil, vinegar, and brown sugar.",
    "ingredients": [
      "1–2 lb sirloin (steak or cubes)",
      "¼ cup soy sauce",
      "¼ cup sesame oil",
      "¼ cup rice wine vinegar",
      "¼ cup brown sugar",
      "1–2 tbsp garlic, minced",
      "¼ tsp black pepper",
      "Vegetable oil, for stir-frying (amount not specified)"
    ],
    "steps": [
      "Slice the beef thinly across the grain.",
      "Combine the soy sauce, sesame oil, rice wine vinegar, brown sugar, minced garlic, and black pepper. Mix well and pour over the beef.",
      "Cover and marinate overnight.",
      "Drain the meat, reserving the marinade.",
      "Stir-fry the beef in a wok or large frying pan over high heat with a small amount of vegetable oil. The original note recommends working in small batches to avoid steaming.",
      "When all the meat is cooked, add the reserved marinade and bring it to a full, rolling boil before serving, since it has contacted raw beef. Heat thoroughly, as the family note directs."
    ],
    "tips": "The handwritten card gives a range of 1–2 lb of sirloin and does not state the number of servings. Do not serve reserved marinade that contacted raw beef without boiling it first."
  },
  {
    "id": "family-tomato-soup",
    "title": "Family Tomato Soup",
    "category": "Soups & Comfort Food",
    "time": "4 min final boil; total time unspecified",
    "servings": 1,
    "yieldUnit": "batch",
    "yieldUnknown": true,
    "source": "Handwritten Smith family tomato soup card; 24 oz tomato sauce jar size confirmed.",
    "sourceUrl": "",
    "description": "An easy creamy tomato soup with Italian seasonings, crushed red pepper, and heavy cream.",
    "ingredients": [
      "2 tbsp olive oil",
      "1 tbsp Italian spices (your choice)",
      "1 tsp crushed red pepper",
      "1 jar (24 oz) tomato sauce",
      "2 cups water",
      "1½ cups heavy cream",
      "Salt and pepper, to taste"
    ],
    "steps": [
      "Preheat the pot and heat the olive oil with the Italian spices and crushed red pepper.",
      "Add the tomato sauce and water. Heat thoroughly, stirring constantly.",
      "Add the heavy cream, season with salt and pepper to taste, and boil for 4 minutes, as the original note says."
    ],
    "tips": "The family confirmed a 24 oz jar of tomato sauce. The original note does not specify the total time, the particular Italian spice blend, or how many bowls it makes."
  },
  {
    "id": "recipe-tin-eats-naan",
    "title": "Fluffy Skillet Naan",
    "category": "Breads & Baking",
    "time": "20 min prep · about 2 hr rising · 10 min cooking",
    "servings": 6,
    "yieldUnit": "naans",
    "source": "Nagi, RecipeTin Eats — printed 'Naan recipe – fluffy, bubbly, chewy!' (original recipe; not a Smith family invention).",
    "sourceUrl": "https://www.recipetineats.com/wprm_print/naan-recipe-fluffy-bubbly-chewy",
    "description": "Soft skillet naan with three selectable preparations: Classic, Garlic Butter, and Cheese.",
    "ingredients": [
      "1 tsp instant or rapid-rise yeast",
      "½ cup warm water (about 105°F)",
      "1 tbsp white sugar",
      "2 tbsp whole milk (low-fat also works)",
      "1½ tbsp whisked egg, at room temperature",
      "½ tsp kosher or cooking salt",
      "1¾ cups bread flour (or all-purpose flour)",
      "2 tbsp (30 g) melted ghee or unsalted butter, for dough",
      "2 tbsp (30 g) melted ghee or butter, for finishing",
      "Nigella seeds, optional",
      "Fresh cilantro, finely chopped, optional"
    ],
    "steps": [
      "Stir yeast, warm water, and sugar together in a small bowl; cover and let stand about 10 minutes until foamy.",
      "Whisk the milk and measured egg together. Sift the flour and salt into a separate bowl.",
      "Mix the yeast mixture, melted dough butter or ghee, and milk–egg mixture into the flour. Bring the mixture into a soft ball with your hands. Kneading is not required.",
      "Cover and leave in a warm place for 1–1½ hours, until doubled in size.",
      "Place on a lightly floured surface, cut into 6 pieces, and shape each into a smooth ball. Rest on a lightly floured tray under a tea towel for 15 minutes, until puffed.",
      "Roll each round to about 3–4 mm thick, approximately 6–7 inches across.",
      "Lightly oil a well-seasoned cast-iron skillet and heat over high heat until wisps of smoke appear.",
      "Cook each naan about 1–1½ minutes until the underside is deeply golden and the top bubbles. Flip and cook for about 1 minute more; adjust heat as needed.",
      "Brush with the melted finishing ghee or butter, add optional nigella seeds and cilantro, and serve hot."
    ],
    "tips": "Original printed recipe: 6 naan, about 20 minutes prep, 10 minutes cooking and 2 hours rising. Bread flour is preferred; all-purpose also works. For 1 batch, whisk an egg and measure 1½ tbsp (about half an egg). Avoid nonstick cookware at the high cooking temperature. To make ahead, refrigerate the dough after its first rise (up to 24 hours according to the original), then allow at least a couple of hours to warm before shaping and finishing the second rise. The source lists 223 kcal per plain naan excluding finishing fat and cheese; nutrition estimates here are not prefilled.",
    "variants": [
      {
        "key": "garlic-butter",
        "label": "🧄 Garlic Butter",
        "description": "Classic fluffy skillet naan finished with fragrant garlic butter.",
        "changes": [
          "Garlic butter finish instead of plain butter",
          "Original dough and skillet technique unchanged"
        ],
        "ingredients": [
          "1 tsp instant or rapid-rise yeast",
          "½ cup warm water (about 105°F)",
          "1 tbsp white sugar",
          "2 tbsp whole milk (low-fat also works)",
          "1½ tbsp whisked egg, at room temperature",
          "½ tsp kosher or cooking salt",
          "1¾ cups bread flour (or all-purpose flour)",
          "2 tbsp (30 g) melted ghee or unsalted butter, for dough",
          "2 tbsp (30 g) salted butter or ghee, for garlic butter",
          "½ tsp crushed garlic, for garlic butter",
          "Nigella seeds, optional",
          "Fresh cilantro, finely chopped, optional"
        ],
        "steps": [
          "Stir the yeast, warm water, and sugar together. Cover for about 10 minutes until foamy.",
          "Whisk the milk and egg, and sift flour with salt. Mix with the yeast mixture and melted dough butter or ghee, forming a soft ball without kneading.",
          "Cover and rise in a warm place for 1–1½ hours until doubled.",
          "Divide into 6 smooth balls, cover on a floured tray, and proof for another 15 minutes.",
          "Roll to about 3–4 mm thick. Lightly oil a well-seasoned cast-iron skillet, heat over high heat until lightly smoking, and cook about 1–1½ minutes on the first side and 1 minute after flipping.",
          "For the topping, melt 2 tbsp salted butter or ghee with ½ tsp crushed garlic in short microwave bursts. Let stand a couple of minutes to infuse.",
          "Brush the freshly cooked naan with the garlic butter. Add optional nigella seeds and chopped cilantro; serve hot."
        ],
        "tips": "This garlic butter option follows the printed RecipeTin Eats Note 5. Garlic is added to finishing butter, not the dough. Avoid nonstick cookware at very high heat."
      },
      {
        "key": "cheese",
        "label": "🧀 Cheese",
        "description": "Soft naan filled with melty cheese and cooked to a golden finish.",
        "changes": [
          "Add roughly ¼ cup shredded cheese to each naan",
          "Roll slightly thicker and cook with a less aggressively heated skillet"
        ],
        "ingredients": [
          "1 tsp instant or rapid-rise yeast",
          "½ cup warm water (about 105°F)",
          "1 tbsp white sugar",
          "2 tbsp whole milk (low-fat also works)",
          "1½ tbsp whisked egg, at room temperature",
          "½ tsp kosher or cooking salt",
          "1¾ cups bread flour (or all-purpose flour)",
          "2 tbsp (30 g) melted ghee or unsalted butter, for dough",
          "2 tbsp (30 g) melted ghee or butter, for filling and finishing",
          "1½ cups shredded melting cheese (about ¼ cup per naan; Monterey Jack, cheddar, Colby, etc.)"
        ],
        "steps": [
          "Mix yeast with warm water and sugar. Cover for 10 minutes until foamy.",
          "Whisk milk and egg; sift flour with salt. Combine with the yeast mixture and melted dough butter or ghee into a soft ball, without kneading.",
          "Cover and rise for 1–1½ hours until doubled. Divide into 6 balls and let rise covered for another 15 minutes.",
          "Roll a dough ball flat and brush lightly with plain melted butter or ghee. Pile about ¼ cup of shredded cheese in the center.",
          "Gather the edges into a pouch around the cheese, twisting to seal; flip seam-side down and roll carefully to about 6–7 mm (¼ inch) thick.",
          "Heat a well-seasoned cast-iron skillet over high heat, but not to the point of smoking. Cook for about 1½ minutes on the first side until golden and puffed, then turn and cook around 45 seconds.",
          "Repeat with the other cheese naan and serve warm."
        ],
        "tips": "Based on the separately printed Cheese Naan instructions. Monterey Jack is a suggested cheese; any well-melting shredded cheese works. Do not overheat a nonstick pan."
      }
    ]
  }
];
