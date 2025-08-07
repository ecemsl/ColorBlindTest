FROM node:22

WORKDIR /app

# Copy only package files first to use cache
COPY package*.json ./

# Install dependencies first
RUN npm install

# Now copy the rest of the files
COPY . .

# Run build
RUN npm run build

# Install serve globally
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
