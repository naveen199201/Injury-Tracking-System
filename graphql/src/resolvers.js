// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();
const {prisma} = require("./database")
const bcrypt = require('bcrypt');
const { GraphQLScalarType, Kind } = require('graphql');

const Report={
  id: (parent, args, context, info) => parent.id,
  nameOfReporter: (parent) => parent.nameOfReporter,
  dateOfInjury: (parent) => parent.dateOfInjury,

}

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO 8601 DateTime scalar',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const Query = {
    reporters: (parent,args) => {
      return prisma.reporter.findMany({})
    },
    reporter: (parent,args) => {
      return prisma.reporter.findFirst({ where: { id:String(args.id) } });
    },
    // reporter: (parent, args) => {
    //   return prisma.reporter.findFirst({
    //     where: { id: Number(args.id) },
    //   });
    // },
    report:  (parent, { id }) => {
      return  prisma.report.findfirst({ where: { id } });
    },
    reports: (parent,args) => {
      return prisma.report.findMany({});
    }, 
    injuries: (parent, args) => {
      return prisma.injury.findMany([]);
    },

    injury: (parent, args) => {
      return prisma.injury.findFirst({
        where: { id: Number(args.id) },
      });
    },

    users : (parent,args) => {
      return prisma.user.findMany({});
    },
    user: (parent, args) => {
      return prisma.user.findFirst({
        where: { id: Number(args.id) },
      });
    },
};

const Mutation = {
    registerReporter: async (_, args) => {
        if (!args.email || !args.email.includes('@')) {
          throw new Error('Invalid email address');
        }
    
        if (!args.password || args.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
    
        // Check if the email is already registered using Prisma Client
        const existingReporter = await prisma.reporter.findUnique({
          where: { email: args.email },
        });
    
        if (existingReporter) {
          throw new Error('Email already in use');
        }
    
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(args.password, 10);
    
        // Create a new user using Prisma Client
        const newReporter = await prisma.reporter.create({
          data: {
            email: args.email,
            password: hashedPassword,
          },
        });
    
        return newReporter;
      },

      registerReport:async  (_, args) => {
        const newReport = await prisma.report.create({
          data:{
          nameOfReporter: args.nameOfReporter,
          dateOfInjury:args.dateOfInjury,
          dateOfReport:args.dateOfReport,          
        },        
      });
  
        // Add the new report to the data sto
        return newReport; // Return the created report
      }, 
      registerInjury:async  (_, args) => {
        const newInjury = await prisma.report.create({
          data:{
          description:args.description,          
        },        
      });
  
        // Add the new report to the data sto
        return newInjury; // Return the created report
      },
      
};


const resolvers = { Report, Query, Mutation,DateTime };

module.exports = {
  resolvers,
};