const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Rental = require('../models/Rental');
const { updateRental, getRentals, addRental, deleteRental } = require('../controllers/rentalController');
const { expect } = chai;

chai.use(chaiHttp);

describe('AddRental Function Test', () => {
    it('should create a new rental successfully', async () => {
        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: {
                carId: new mongoose.Types.ObjectId().toString(),
                pickupDate: "2025-04-01",
                returnDate: "2025-04-05"
            }
        };
        const createdRental = {
            _id: new mongoose.Types.ObjectId(),
            ...req.body,
            userId: req.user.id,
            status: 'confirmed'
        };
        const createStub = sinon.stub(Rental, 'create').resolves(createdRental);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await addRental(req, res);

        expect(createStub.calledOnceWith({
            userId: req.user.id,
            carId: new mongoose.Types.ObjectId(req.body.carId),
            pickupDate: new Date(req.body.pickupDate),
            returnDate: new Date(req.body.returnDate),
            status: 'confirmed'
        })).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(createdRental)).to.be.true;

        createStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        const createStub = sinon.stub(Rental, 'create').throws(new Error('DB Error'));
        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: {
                carId: new mongoose.Types.ObjectId().toString(),
                pickupDate: "2025-04-01",
                returnDate: "2025-04-05"
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await addRental(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        createStub.restore();
    });
});

describe('UpdateRental Function Test', () => {
    it('should update rental successfully', async () => {
        const rentalId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();
        const existingRental = {
            _id: rentalId,
            userId: userId,
            carId: new mongoose.Types.ObjectId(),
            pickupDate: new Date("2025-03-01"),
            returnDate: new Date("2025-03-05"),
            status: 'confirmed',
            save: sinon.stub().resolvesThis()
        };
        const findByIdStub = sinon.stub(Rental, 'findById').resolves(existingRental);

        const req = {
            params: { id: rentalId.toString() },
            user: { id: userId.toString() },
            body: {
                carId: new mongoose.Types.ObjectId().toString(),
                pickupDate: "2025-04-01",
                returnDate: "2025-04-05"
            }
        };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await updateRental(req, res);

        expect(existingRental.carId.toString()).to.equal(req.body.carId);
        expect(existingRental.pickupDate).to.deep.equal(new Date(req.body.pickupDate));
        expect(existingRental.returnDate).to.deep.equal(new Date(req.body.returnDate));
        expect(res.json.calledOnce).to.be.true;

        findByIdStub.restore();
    });

    it('should return 404 if rental is not found', async () => {
        const rentalId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();
        const findByIdStub = sinon.stub(Rental, 'findById').resolves(null);
        const req = {
            params: { id: rentalId.toString() },
            user: { id: userId.toString() },
            body: {}
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateRental(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Rental not found' })).to.be.true;

        findByIdStub.restore();
    });

    it('should return 500 on error', async () => {
        const rentalId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();
        const findByIdStub = sinon.stub(Rental, 'findById').throws(new Error('DB Error'));
        const req = {
            params: { id: rentalId.toString() },
            user: { id: userId.toString() },
            body: {},
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateRental(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.called).to.be.true;

        findByIdStub.restore();
    });
});

describe('GetRental Function Test', () => {
    it('should return rentals for the given user', async () => {
        const userId = new mongoose.Types.ObjectId();
        const rentals = [
            {
                _id: new mongoose.Types.ObjectId(),
                userId,
                carId: new mongoose.Types.ObjectId(),
                pickupDate: new Date("2025-04-01"),
                returnDate: new Date("2025-04-05"),
                status: 'confirmed'
            },
            {
                _id: new mongoose.Types.ObjectId(),
                userId,
                carId: new mongoose.Types.ObjectId(),
                pickupDate: new Date("2025-05-01"),
                returnDate: new Date("2025-05-05"),
                status: 'confirmed'
            }
        ];
        const findStub = sinon.stub(Rental, 'find').returns({
            populate: sinon.stub().resolves(rentals)
        });

        const req = { user: { id: userId } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getRentals(req, res);

        expect(findStub.calledOnceWith({ userId })).to.be.true;
        expect(res.json.calledWith(rentals)).to.be.true;
        expect(res.status.called).to.be.false;

        findStub.restore();
    });

    it('should return 500 on error', async () => {
        const findStub = sinon.stub(Rental, 'find').throws(new Error('DB Error'));
        const req = { user: { id: new mongoose.Types.ObjectId() } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getRentals(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        findStub.restore();
    });
});

describe('DeleteRental Function Test', () => {
    it('should delete a rental successfully', async () => {
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
        const rental = { remove: sinon.stub().resolves() };
        const findByIdStub = sinon.stub(Rental, 'findById').resolves(rental);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await deleteRental(req, res);

        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(rental.remove.calledOnce).to.be.true;
        expect(res.json.calledWith({ message: 'Rental deleted' })).to.be.true;

        findByIdStub.restore();
    });

    it('should return 404 if rental is not found', async () => {
        const findByIdStub = sinon.stub(Rental, 'findById').resolves(null);
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await deleteRental(req, res);

        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Rental not found' })).to.be.true;

        findByIdStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        const findByIdStub = sinon.stub(Rental, 'findById').throws(new Error('DB Error'));
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await deleteRental(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        findByIdStub.restore();
    });
});