
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Rental = require('../models/Rental');
const { updateRental, getRentals, addRental, deleteRental } = require('../controllers/rentalController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddRental Function Test', () => {

    it('should create a new rental successfully', async () => {
        // Mock request data
        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: { title: "New Rental", description: "Rental description", deadline: "2025-12-31" }
        };

        // Mock rental that would be created
        const createdRental = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

        // Stub Rental.create to return the createdRental
        const createStub = sinon.stub(Rental, 'create').resolves(createdRental);

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await addRental(req, res);

        // Assertions
        expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(createdRental)).to.be.true;

        // Restore stubbed methods
        createStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        // Stub Rental.create to throw an error
        const createStub = sinon.stub(Rental, 'create').throws(new Error('DB Error'));

        // Mock request data
        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: { title: "New Rental", description: "Rental description", deadline: "2025-12-31" }
        };

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await addRental(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        // Restore stubbed methods
        createStub.restore();
    });

});


describe('Update Function Test', () => {

    it('should update rental successfully', async () => {
        // Mock rental data
        const rentalId = new mongoose.Types.ObjectId();
        const existingRental = {
            _id: rentalId,
            title: "Old Rental",
            description: "Old Description",
            completed: false,
            deadline: new Date(),
            save: sinon.stub().resolvesThis(), // Mock save method
        };
        // Stub Rental.findById to return mock rental
        const findByIdStub = sinon.stub(Rental, 'findById').resolves(existingRental);

        // Mock request & response
        const req = {
            params: { id: rentalId },
            body: { title: "New Rental", completed: true }
        };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call function
        await updateRental(req, res);

        // Assertions
        expect(existingRental.title).to.equal("New Rental");
        expect(existingRental.completed).to.equal(true);
        expect(res.status.called).to.be.false; // No error status should be set
        expect(res.json.calledOnce).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });



    it('should return 404 if rental is not found', async () => {
        const findByIdStub = sinon.stub(Rental, 'findById').resolves(null);

        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
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
        const findByIdStub = sinon.stub(Rental, 'findById').throws(new Error('DB Error'));

        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
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
        // Mock user ID
        const userId = new mongoose.Types.ObjectId();

        // Mock rental data
        const rentals = [
            { _id: new mongoose.Types.ObjectId(), title: "Rental 1", userId },
            { _id: new mongoose.Types.ObjectId(), title: "Rental 2", userId }
        ];

        // Stub Rental.find to return mock rentals
        const findStub = sinon.stub(Rental, 'find').resolves(rentals);

        // Mock request & response
        const req = { user: { id: userId } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call function
        await getRentals(req, res);

        // Assertions
        expect(findStub.calledOnceWith({ userId })).to.be.true;
        expect(res.json.calledWith(rentals)).to.be.true;
        expect(res.status.called).to.be.false; // No error status should be set

        // Restore stubbed methods
        findStub.restore();
    });

    it('should return 500 on error', async () => {
        // Stub Rental.find to throw an error
        const findStub = sinon.stub(Rental, 'find').throws(new Error('DB Error'));

        // Mock request & response
        const req = { user: { id: new mongoose.Types.ObjectId() } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call function
        await getRentals(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        // Restore stubbed methods
        findStub.restore();
    });

});



describe('DeleteRental Function Test', () => {

    it('should delete a rental successfully', async () => {
        // Mock request data
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        // Mock rental found in the database
        const rental = { remove: sinon.stub().resolves() };

        // Stub Rental.findById to return the mock rental
        const findByIdStub = sinon.stub(Rental, 'findById').resolves(rental);

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await deleteRental(req, res);

        // Assertions
        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(rental.remove.calledOnce).to.be.true;
        expect(res.json.calledWith({ message: 'Rental deleted' })).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

    it('should return 404 if rental is not found', async () => {
        // Stub Rental.findById to return null
        const findByIdStub = sinon.stub(Rental, 'findById').resolves(null);

        // Mock request data
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await deleteRental(req, res);

        // Assertions
        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Rental not found' })).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        // Stub Rental.findById to throw an error
        const findByIdStub = sinon.stub(Rental, 'findById').throws(new Error('DB Error'));

        // Mock request data
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await deleteRental(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

});