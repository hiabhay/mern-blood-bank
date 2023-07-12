const router = require('express').Router();
const Inventory = require('../models/inventoryModel');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');

router.post('/add', authMiddleware, async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error('Invalid Email');
        if (req.body.inventoryType === 'in' && user.userType !== 'donor') {
            throw new Error('This Email is not registered as a donor.')
        }
        if (req.body.inventoryType === 'out' && user.userType !== 'hospital') {
            throw new Error('This Email is not registered as a hospital.')
        }

        if (req.body.inventoryType === 'out') {

            const requestedGroup = req.body.bloodGroup;
            const requestedQuantity = req.body.quantity;
            const organization = new mongoose.Types.ObjectId(req.body.userId);

            const totalInOfRequestedGroup = await Inventory.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: 'in',
                        bloodGroup: requestedGroup
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);

            const totalIn = totalInOfRequestedGroup[0].total || 0;

            const totalOutOfRequestedGroup = await Inventory.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: 'out',
                        bloodGroup: requestedGroup
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);

            const totalOut = totalOutOfRequestedGroup[0]?.total || 0;

            const availableQuantityOfRequestedGroup = totalIn - totalOut;

            if (availableQuantityOfRequestedGroup < requestedQuantity) {
                throw new Error(`Only ${availableQuantityOfRequestedGroup} units of ${requestedGroup.toUpperCase()} is available.`)
            }

            req.body.hospital = user._id;
        } else {
            req.body.donor = user._id;
        }

        const inventory = new Inventory(req.body);
        await inventory.save();

        return res.send({ success: true, message: 'Inventory added successfully' });

    } catch (error) {
        return res.send({ success: false, message: error.message })
    }
});

router.get("/get", authMiddleware, async (req, res) => {
    try {
        const inventory = await Inventory.find({ organization: req.body.userId })
            .sort({ createdAt: -1 })
            .populate("donor")
            .populate("hospital");
        return res.send({ success: true, data: inventory });
    } catch (error) {
        return res.send({ success: false, message: error.message });
    }
});

router.post("/filter", authMiddleware, async (req, res) => {
    try {
        const inventory = await Inventory.find(req.body.filters).limit(req.body.limit || 10)
            .sort({ createdAt: -1 })
            .populate("donor")
            .populate("hospital").populate('organization');
        return res.send({ success: true, data: inventory });
    } catch (error) {
        return res.send({ success: false, message: error.message });
    }
});


module.exports = router;