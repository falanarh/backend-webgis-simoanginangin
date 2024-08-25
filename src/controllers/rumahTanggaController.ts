import { Request, Response } from "express";
import mongoose from "mongoose";  // Import mongoose for ObjectId
import rumahTanggaService from "../services/rumahTanggaService";

const addRumahTangga = async (req: Request, res: Response) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const newRumahTangga = await rumahTanggaService.addRumahTangga(data);
    res.status(201).json({
      statusCode: 201,
      message: "RumahTangga created successfully",
      data: newRumahTangga,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const updateRumahTangga = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const objectId = new mongoose.Types.ObjectId(id);

    if (!mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid ID format",
      });
    }
    
    const updatedRumahTangga = await rumahTanggaService.updateRumahTangga(
      objectId,
      req.body
    );
    
    if (!updatedRumahTangga) {
      return res.status(404).json({
        statusCode: 404,
        message: "RumahTangga not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "RumahTangga updated successfully",
      data: updatedRumahTangga,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const deleteRumahTangga = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const objectId = new mongoose.Types.ObjectId(id);

    if (!mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid ID format",
      });
    }
    
    const deletedRumahTangga = await rumahTanggaService.deleteRumahTangga(objectId);
    
    if (!deletedRumahTangga) {
      return res.status(404).json({
        statusCode: 404,
        message: "RumahTangga not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "RumahTangga deleted successfully",
      data: deletedRumahTangga,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const getRumahTanggaByKode = async (req: Request, res: Response) => {
  try {
    const rumahTangga = await rumahTanggaService.getRumahTanggaByKode(
      req.params.kode
    );
    if (!rumahTangga) {
      return res.status(404).json({
        statusCode: 404,
        message: "RumahTangga not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "RumahTangga fetched successfully",
      data: rumahTangga,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const getAllRumahTangga = async (req: Request, res: Response) => {
  try {
    const rumahTanggaList = await rumahTanggaService.getAllRumahTangga();
    res.status(200).json({
      statusCode: 200,
      message: "RumahTangga fetched successfully",
      data: rumahTanggaList,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export default {
  addRumahTangga,
  updateRumahTangga,
  deleteRumahTangga,
  getRumahTanggaByKode,
  getAllRumahTangga,
};
