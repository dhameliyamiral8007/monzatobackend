const Page = require('../models/Page');

const defaultPages = {
  'the-story': {
    title: 'The Monzato Story',
    slug: 'the-story',
    content: `Monzato is an international fashion company dedicated to redefining the modern professional wardrobe. We focus on creating polished, sophisticated styles that cater to every aspect of your look, from head to toe. At Monzato, we are committed to delivering high-quality products and crafting contemporary menswear that embodies upper-market sophistication.\n\nOur brand is driven by a passion for inspiring our customers. We use striking imagery and thoughtful design to ignite the senses and spark creativity worldwide. Customers are at the core of everything we do. We prioritize their satisfaction by ensuring that each product we create is of the highest value.\n\nMonzato's extensive collection offers something for everyone, allowing our customers to explore and embrace their unique fashion sense. We invite you to dream with us and enjoy meticulously crafted aesthetic styles, all at an accessible price.`,
    isPublished: true,
  },
  'delivery-returns': {
    title: 'RETURN POLICY',
    slug: 'delivery-returns',
    content: `You have the right to return products purchased on www.monzato.com (the "Website") by notifying Monzato Corporation (the "Vendor") within Seven (7) days from the day you receive the products. Once you have exercised your right of return in accordance with the procedures set forth below, the products to be returned must be handed over to the courier in one single shipment within Seven (7) days of from the day you receive the products. You will therefore be refunded for the price of the product or products that were originally purchased, according to the terms provided for in this policy.\n\n1. RETURN CONDITIONS\n\nThe Vendor only accepts returns of merchandise within the time frames set forth above, and will reimburse the purchase price of the products (minus shipping fees, and tax payable as applicable) only if the following conditions have been met:\n1. The products have not been used, worn or washed and are in the same conditions in which they were received and, in any case, must be compliant with the requirements detailed in the section on Compliance Checks below;\n2. The identification tag (with the disposable seal) and labels are still attached to the products;\n3. The products are returned in their original packaging; and\n4. The products are not damaged.\n\nYou cannot return customised or personalised products, or sealed items that were opened after delivery and that cannot be returned due to health or hygiene reasons (e.g., cosmetics). Final sales items, swimwear, undergarments, and jewellery cannot be returned.`,
    isPublished: true,
  },
  'privacy-policy': {
    title: 'PRIVACY POLICY',
    slug: 'privacy-policy',
    content: `Monzato is committed to protecting your privacy. This Privacy Policy describes the types of information we collect from and about you when you visit Monzato.com. This Privacy Policy also explains how we may use and disclose such information through the Services, as well as your ability to control certain uses of it. You should review this Privacy Policy from time to time as it may be changed. By using any of the Services, you agree to the collection, use, and disclosure of your personal information as described in this Privacy Policy.\n\nInformation Customers Provide\n\nMonzato collects personal information from you when you choose to share it with us. This may include when you use our Services, register for an online account, make a purchase, request information from us, sign up for newsletters or our email list, use our service, participate in a survey or promotion, or otherwise contact us. The personal information we collect may include:\n\n• Name\n• Mailing or Shipping Address\n• Email Address\n• Telephone Number`,
    isPublished: true,
  },
};

// @desc    Get all pages
// @route   GET /api/pages
// @access  Public
const getPages = async (req, res) => {
  try {
    let pages = await Page.find({}).sort({ createdAt: -1 });

    // Seed defaults if database is empty
    if (pages.length === 0) {
      await Page.insertMany(Object.values(defaultPages));
      pages = await Page.find({}).sort({ createdAt: -1 });
    }

    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single page by slug
// @route   GET /api/pages/:slug
// @access  Public
const getPageBySlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    let page = await Page.findOne({ slug });

    // Fallback & Auto-seed for standard pages if missing in DB
    if (!page && defaultPages[slug]) {
      page = await Page.create(defaultPages[slug]);
    }

    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update a page (Admin)
// @route   POST /api/pages or PUT /api/pages/:id
// @access  Private/Admin
const createOrUpdatePage = async (req, res) => {
  try {
    const { title, slug, content, isPublished } = req.body;
    const pageId = req.params.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    let page;
    if (pageId) {
      page = await Page.findById(pageId);
    } else {
      page = await Page.findOne({ slug: cleanSlug });
    }

    if (page) {
      page.title = title || page.title;
      page.slug = cleanSlug || page.slug;
      page.content = content || page.content;
      if (isPublished !== undefined) page.isPublished = Boolean(isPublished);

      const updatedPage = await page.save();
      return res.json(updatedPage);
    } else {
      const newPage = await Page.create({
        title,
        slug: cleanSlug,
        content,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      });
      return res.status(201).json(newPage);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete page (Admin)
// @route   DELETE /api/pages/:id
// @access  Private/Admin
const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (page) {
      await page.deleteOne();
      res.json({ message: 'Page deleted successfully' });
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPages,
  getPageBySlug,
  createOrUpdatePage,
  deletePage,
};
