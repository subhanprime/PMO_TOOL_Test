"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLogistics = exports.deleteLogistics = exports.getLogisticsByProject = exports.createLogistics = void 0;
const joi_1 = __importDefault(require("joi"));
const projects_1 = __importDefault(require("../../models/projects"));
const logistics_model_1 = __importDefault(require("../../models/logistics/logistics.model"));
const logisticsSchema = joi_1.default.object({
    category: joi_1.default.string().required(),
    logistics_type: joi_1.default.string().required(),
    total_quantity_required: joi_1.default.number().integer().required(),
    planned_cost: joi_1.default.number().precision(2).required(),
    responsible_person: joi_1.default.string().required(),
    finish_timeline: joi_1.default.date().required(),
    projectId: joi_1.default.number().integer().required(),
    requirement_phase_1: joi_1.default.string().optional().allow(null, ""),
    requirement_phase_2: joi_1.default.string().optional().allow(null, ""),
    requirement_phase_3: joi_1.default.string().optional().allow(null, ""),
    expected_supplier_1: joi_1.default.string().optional().allow(null, ""),
    expected_supplier_2: joi_1.default.string().optional().allow(null, ""),
    expected_supplier_3: joi_1.default.string().optional().allow(null, ""),
});
const createLogistics = async (req, res, next) => {
    const { error } = logisticsSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { category, logistics_type, total_quantity_required, planned_cost, responsible_person, finish_timeline, projectId, requirement_phase_1, requirement_phase_2, requirement_phase_3, expected_supplier_1, expected_supplier_2, expected_supplier_3, } = req.body;
    try {
        // Check if the associated project exists
        const project = await projects_1.default.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        // Create a new logistics entry
        const logistics = await logistics_model_1.default.create({
            category,
            logistics_type,
            total_quantity_required,
            planned_cost,
            responsible_person,
            finish_timeline,
            projectId,
            requirement_phase_1,
            requirement_phase_2,
            requirement_phase_3,
            expected_supplier_1,
            expected_supplier_2,
            expected_supplier_3,
        });
        return res.status(201).json(logistics);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "An error occurred while creating the logistics entry" });
    }
};
exports.createLogistics = createLogistics;
const getLogisticsByProject = async (req, res, next) => {
    const { projectId } = req.params;
    try {
        // Check if the project exists
        const project = await projects_1.default.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        // Retrieve all logistics entries for the project
        const logistics = await logistics_model_1.default.findAll({ where: { projectId } });
        return res.status(200).json(logistics);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "An error occurred while retrieving logistics entries" });
    }
};
exports.getLogisticsByProject = getLogisticsByProject;
const deleteLogistics = async (req, res) => {
    const { logisticsId } = req.params;
    try {
        // Check if the logistics entry exists
        const logistics = await logistics_model_1.default.findByPk(logisticsId);
        if (!logistics) {
            return res.status(404).json({ error: "Logistics entry not found" });
        }
        // Delete the logistics entry
        await logistics.destroy();
        return res
            .status(200)
            .json({ message: "Logistics entry deleted successfully" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "An error occurred while deleting the logistics entry" });
    }
};
exports.deleteLogistics = deleteLogistics;
const updateLogistics = async (req, res) => {
    const { logisticsId } = req.params;
    const { error } = logisticsSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { category, logistics_type, total_quantity_required, planned_cost, responsible_person, finish_timeline, requirement_phase_1, requirement_phase_2, requirement_phase_3, expected_supplier_1, expected_supplier_2, expected_supplier_3, } = req.body;
    try {
        // Check if the logistics entry exists
        const logistics = await logistics_model_1.default.findByPk(logisticsId);
        if (!logistics) {
            return res.status(404).json({ error: "Logistics entry not found" });
        }
        // Update the logistics entry (excluding projectId)
        await logistics.update({
            category,
            logistics_type,
            total_quantity_required,
            planned_cost,
            responsible_person,
            finish_timeline,
            requirement_phase_1,
            requirement_phase_2,
            requirement_phase_3,
            expected_supplier_1,
            expected_supplier_2,
            expected_supplier_3,
        });
        return res.status(200).json(logistics);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "An error occurred while updating the logistics entry" });
    }
};
exports.updateLogistics = updateLogistics;
