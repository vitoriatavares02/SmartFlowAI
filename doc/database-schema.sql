-- SmartFlow Database Schema
-- MySQL Script for process automation requests management

CREATE DATABASE IF NOT EXISTS smartflow_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE smartflow_db;

-- Table structure for `users`
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Administrador', 'Solicitante') NOT NULL DEFAULT 'Solicitante',
  `department` VARCHAR(100) NOT NULL DEFAULT 'Geral',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `requests`
CREATE TABLE IF NOT EXISTS `requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Geral',
  `priority` ENUM('Baixa', 'Média', 'Alta', 'Crítica') NOT NULL DEFAULT 'Média',
  `department` VARCHAR(100) NOT NULL DEFAULT 'TI',
  `status` ENUM('Pendente', 'Em Andamento', 'Resolvido', 'Cancelado') NOT NULL DEFAULT 'Pendente',
  `ai_keywords` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Users
INSERT INTO `users` (`name`, `email`, `password`, `role`, `department`) VALUES
('Administrador SmartFlow', 'admin@smartflow.com', 'admin123', 'Administrador', 'TI'),
('João Silva (Solicitante)', 'user@smartflow.com', 'user123', 'Solicitante', 'Vendas'),
('Maria Oliveira (Solicitante)', 'maria@smartflow.com', 'user123', 'Solicitante', 'Financeiro')
ON DUPLICATE KEY UPDATE `email`=`email`;

-- Sample Seed Requests
INSERT INTO `requests` (`user_id`, `title`, `description`, `category`, `priority`, `department`, `status`, `ai_keywords`) VALUES
(2, 'Compra de notebook de alta performance', 'Preciso de um notebook de alto desempenho para trabalhar com desenvolvimento de software e IA.', 'Equipamentos', 'Alta', 'TI', 'Pendente', '["notebook", "desenvolvimento", "hardware"]'),
(3, 'Solicitação de acesso ao servidor de staging', 'Solicito liberação de acesso SSH para a máquina de testes de desenvolvimento.', 'Acesso ao sistema', 'Média', 'TI', 'Em Andamento', '["acesso", "servidor", "ssh", "staging"]'),
(2, 'Aprovação de férias do trimestre', 'Gostaria de agendar minhas férias para o próximo mês conforme alinhado com a liderança.', 'Recursos Humanos', 'Baixa', 'RH', 'Resolvido', '["férias", "agendamento", "rh"]');
